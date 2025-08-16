import { jest } from "@jest/globals";
import { internalFormGuests } from "../inMemoryStorage/cache";
import { getClients } from "../src/intake_forms/client_intake";
import { _invalidChecker, flagger } from "../src/intake_forms/flagger";
import { Clients, emptyErroneous, Erroneous } from "../src/intake_forms/custom_types";
import { headOfHouseholdWithOneMember, mockClientComplete, mockClientMissingOneRequiredNull, onlyHeadOfHousehold } from "./mock_clients";
import { _checkForDuplicates, _removeOldClients } from "../src/internalTimer";

const testingSet = new Set<Erroneous>();

jest.mock("../inMemoryStorage/cache", () => ({
    internalFormGuests: testingSet,
}));

//mock erroneous clients
//invalid checker is the current function that flags all relevant fields
const client1: Erroneous = _invalidChecker(mockClientComplete, emptyErroneous() as Erroneous);
const client2: Erroneous = _invalidChecker(mockClientMissingOneRequiredNull, emptyErroneous() as Erroneous);
const client3: Erroneous = _invalidChecker(onlyHeadOfHousehold, emptyErroneous() as Erroneous);
const client4: Erroneous = _invalidChecker(headOfHouseholdWithOneMember, emptyErroneous() as Erroneous);

const now: number = Date.now();
const clients = [client1, client2, client3, client4];

describe.each([
    {
        description: "should remove clients older than 30 days",
        days: 30,
        initialClients: [
            { ...clients[0], timestamp: now - 31 * 24 * 60 * 60 * 1000 }, // older than 30 days
            { ...clients[1], timestamp: now - 29 * 24 * 60 * 60 * 1000 }, // within 30 days
        ],
        expectedRemainingClients: [{ ...clients[1], timestamp: now - 29 * 24 * 60 * 60 * 1000 }],
    },
    {
        description: "should remove clients older than 60 days",
        days: 60,
        initialClients: [
            { ...clients[0], timestamp: now - 61 * 24 * 60 * 60 * 1000 }, // older than 60 days
            { ...clients[1], timestamp: now - 59 * 24 * 60 * 60 * 1000 }, // within 60 days
        ],
        expectedRemainingClients: [{ ...clients[1], timestamp: now - 59 * 24 * 60 * 60 * 1000 }],
    },
    {
        description: "should remove clients if within 1 day",
        days: 1,
        initialClients: [
            { ...clients[2], timestamp: now - 2 * 24 * 60 * 60 * 1000 }, // older than 1 day
            { ...clients[3], timestamp: now - 12 * 60 * 60 * 1000 }, // within 1 day
        ],
        expectedRemainingClients: [{ ...clients[3], timestamp: now - 12 * 60 * 60 * 1000 }],
    },
    {
        description: "should remove clients older than 90 days",
        days: 90,
        initialClients: [
            { ...clients[0], timestamp: now - 91 * 24 * 60 * 60 * 1000 }, // older than 90 days
            { ...clients[1], timestamp: now - 89 * 24 * 60 * 60 * 1000 }, // within 90 days
        ],
        expectedRemainingClients: [{ ...clients[1], timestamp: now - 89 * 24 * 60 * 60 * 1000 }],
    },
    {
        description: "should remove 4 clients older than specified days",
        days: 15,
        initialClients: [
            { ...clients[0], timestamp: now - 20 * 24 * 60 * 60 * 1000 }, // older than specified days
            { ...clients[1], timestamp: now - 10 * 24 * 60 * 60 * 1000 }, // within specified days
            { ...clients[2], timestamp: now - 16 * 24 * 60 * 60 * 1000 }, // older than specified days
            { ...clients[3], timestamp: now - 5 * 24 * 60 * 60 * 1000 }, // within specified days
        ],
        expectedRemainingClients: [
            { ...clients[1], timestamp: now - 10 * 24 * 60 * 60 * 1000 },
            { ...clients[3], timestamp: now - 5 * 24 * 60 * 60 * 1000 },
        ],
    },
    {
        description: "should not remove clients if all are within the specified days",
        days: 15,
        initialClients: [
            { ...clients[2], timestamp: now - 10 * 24 * 60 * 60 * 1000 }, // within 15 days
            { ...clients[3], timestamp: now - 5 * 24 * 60 * 60 * 1000 }, // within 15 days
        ],
        expectedRemainingClients: [
            { ...clients[2], timestamp: now - 10 * 24 * 60 * 60 * 1000 },
            { ...clients[3], timestamp: now - 5 * 24 * 60 * 60 * 1000 },
        ],
    },
    {
        description: "should skip clients without a timestamp",
        days: 20,
        initialClients: [
            { ...clients[0] }, // has timestamp
            { ...clients[1], timestamp: undefined }, // no timestamp
        ],
        expectedRemainingClients: [
            { ...clients[0] },
            { ...clients[1], timestamp: undefined },
        ],
    },
    {
        description: "should handle empty initial clients",
        days: 10,
        initialClients: [],
        expectedRemainingClients: [],
    },
    {
        description: "should delete all clients if they are all older than the specified days",
        days: 5,
        initialClients: [
            { ...clients[0], timestamp: now - 10 * 24 * 60 * 60 * 1000 }, // older than 5 days
            { ...clients[1], timestamp: now - 6 * 24 * 60 * 60 * 1000 }, // older than 5 days
        ],
        expectedRemainingClients: [],
    },
])("$description", ({ days, initialClients, expectedRemainingClients }) => {
    beforeEach(() => {
        internalFormGuests.clear();
        initialClients.forEach((client) => internalFormGuests.add(client as Erroneous));
        jest.spyOn(console, "warn").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should process clients correctly", async () => {
        await _removeOldClients(days);

        const remainingClients = Array.from(internalFormGuests);
        expect(remainingClients).toEqual(expect.arrayContaining(expectedRemainingClients));
        expect(remainingClients.length).toBe(expectedRemainingClients.length);
    });

    it("should log a warning for clients without a timestamp", async () => {
        const warnSpy = jest.spyOn(console, "warn");
        await _removeOldClients(days);

        initialClients.forEach((client) => {
            if (!client.timestamp) {
                expect(warnSpy).toHaveBeenCalledWith(
                    "Client does not have a timestamp, skipping removal check:",
                    client
                );
            }
        });
    });
});
describe.each([
    {
        description: "should identify duplicates and non-duplicates correctly",
        initialInternalGuests: new Set([clients[0]]),
        clientsPulledFromForm: new Set([clients[0], clients[1]]),
        expectedDuplicates: new Set([clients[0]]),
        expectedNonDuplicates: new Set([clients[1]]),
    },
    {
        description: "should identify multiple duplicates and multiple non-duplicates",
        initialInternalGuests: new Set([clients[0], clients[1]]),
        clientsPulledFromForm: new Set([clients[0], clients[1], clients[2], clients[3]]),
        expectedDuplicates: new Set([clients[0], clients[1]]),
        expectedNonDuplicates: new Set([clients[2], clients[3]]),
    },
    {
        description: "should handle an empty set of clients",
        initialInternalGuests: new Set(),
        clientsPulledFromForm: new Set(),
        expectedDuplicates: new Set(),
        expectedNonDuplicates: new Set(),
    },
    {
        description: "should add a single client as non-duplicate if internal storage is empty",
        initialInternalGuests: new Set(),
        clientsPulledFromForm: new Set([clients[0]]),
        expectedDuplicates: new Set(),
        expectedNonDuplicates: new Set([clients[0]]),
    },
    {
        description: "should mark a single client as a duplicate",
        initialInternalGuests: new Set([clients[0]]),
        clientsPulledFromForm: new Set([clients[0]]),
        expectedDuplicates: new Set([clients[0]]),
        expectedNonDuplicates: new Set(),
    },
    {
        description: "should handle multiple clients that are duplicates",
        initialInternalGuests: new Set([clients[0], clients[1]]),
        clientsPulledFromForm: new Set([clients[0], clients[1]]),
        expectedDuplicates: new Set([clients[0], clients[1]]),
        expectedNonDuplicates: new Set(),
    },
    {
        description: "should handle a single client that is not a duplicate",
        initialInternalGuests: new Set([clients[0]]),
        clientsPulledFromForm: new Set([clients[1]]),
        expectedDuplicates: new Set(),
        expectedNonDuplicates: new Set([clients[1]]),
    },
    {
        description: "should handle no duplicates when all clients are new",
        initialInternalGuests: new Set(),
        clientsPulledFromForm: new Set([clients[2], clients[3]]),
        expectedDuplicates: new Set(),
        expectedNonDuplicates: new Set([clients[2], clients[3]]),
    },
    {
        description: "should handle multiple duplicates and non-duplicates",
        initialInternalGuests: new Set([clients[0], clients[1]]),
        clientsPulledFromForm: new Set([clients[0], clients[1], clients[2]]),
        expectedDuplicates: new Set([clients[0], clients[1]]),
        expectedNonDuplicates: new Set([clients[2]]),
    }
])("$description", ({ initialInternalGuests, clientsPulledFromForm, expectedDuplicates, expectedNonDuplicates }) => {
    beforeEach(() => {
        internalFormGuests.clear();
        initialInternalGuests.forEach((client) => internalFormGuests.add(client as Erroneous));
        jest.spyOn(console, "log").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should process duplicates and non-duplicates correctly", () => {
        const { duplicates, nonDuplicates } = _checkForDuplicates(clientsPulledFromForm as Set<Erroneous>);

        expect(duplicates).toEqual(expectedDuplicates);
        expect(nonDuplicates).toEqual(expectedNonDuplicates);
        //expect the size to be the same, even if there are duplicates
        expect(duplicates.size + nonDuplicates.size).toBe(clientsPulledFromForm.size);
        //check to make sure that the internalFormGuests does not change
        expect(internalFormGuests.size).toBe(initialInternalGuests.size);
        expect(internalFormGuests).toEqual(initialInternalGuests);
    });
    it("should log duplicates and new clients correctly", () => {
        const logSpy = jest.spyOn(console, "log");
        const { duplicates, nonDuplicates } = _checkForDuplicates(clientsPulledFromForm as Set<Erroneous>);

        duplicates.forEach((client) => {
            expect(logSpy).toHaveBeenCalledWith("Duplicate client found:", client);
            //and not called as new client found
            expect(logSpy).not.toHaveBeenCalledWith("New client added:", client);
        });
        nonDuplicates.forEach((client) => {
            expect(logSpy).toHaveBeenCalledWith("New client added:", client);
            //and not called as duplicate client found
            expect(logSpy).not.toHaveBeenCalledWith("Duplicate client found:", client);
        });

        if (duplicates.size === 0) {
            expect(logSpy).toHaveBeenCalledWith("No duplicates found");
        }
        if (nonDuplicates.size === 0) {
            expect(logSpy).toHaveBeenCalledWith("No new clients added");
        }

        expect(logSpy).toHaveBeenCalledWith(`Found ${duplicates.size} duplicates and ${nonDuplicates.size} non-duplicates.`);
    });
    it("should check for deep equality of Erroneous objects", () => {
        const client1Copy = { ...client1, FBMGuest: { ...client1.FBMGuest } };
        const client2Copy = { ...client2, FBMGuest: { ...client2.FBMGuest } };
        const client3Copy = { ...client3, FBMGuest: { ...client3.FBMGuest } };
        const client4Copy = { ...client4, FBMGuest: { ...client4.FBMGuest } };

        expect(_checkForDuplicates(new Set([client1Copy, client2Copy]))).toEqual({
            duplicates: new Set([client1Copy]),
            nonDuplicates: new Set([client2Copy])
        });
        expect(_checkForDuplicates(new Set([client3Copy, client4Copy]))).toEqual({
            duplicates: new Set(),
            nonDuplicates: new Set([client3Copy, client4Copy])
        });
    });

});
