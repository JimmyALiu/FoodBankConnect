import { internalFormGuests } from "../inMemoryStorage/cache";
import { getClients } from "./intake_forms/client_intake";
import { Clients, Erroneous } from "./intake_forms/custom_types";
import { flagger } from "./intake_forms/flagger";
import { assert } from "console";

/**
 * function which handles the internal timer and logic for updating the internal cache
 * This function is called when the server starts and runs every minute.
 */
export function startInternalTimer() {
    setInterval(async () => {
        const clientsPulledFromForm: Set<Erroneous> | undefined = await _getClientsFromForm();
        assert(clientsPulledFromForm !== undefined, "Clients pulled from form should not be undefined");
        if (clientsPulledFromForm === undefined) {
            console.error("Failed to pull clients from form.");
            return;
        }
        //check for duplicates that already exist in the internalFormGuests
        const { duplicates, nonDuplicates } = _checkForDuplicates(clientsPulledFromForm);

        //add the nonDuplicates, not gonna create a new function for a simple foreach
        nonDuplicates.forEach((client) => {
            internalFormGuests.add(client);
        });

        console.log("Internal timer tick");

        //remove all clients that are older than 30 days
        _removeOldClients(30);
    }, 60000);
}

/**
 * gets the clients from the form, processes them, and returns a Set of Erroneous clients.
 * @returns a Set of Erroneous clients purely from the form. Could have repeats from previous attempts
 */
export async function _getClientsFromForm(): Promise<Set<Erroneous> | undefined> {
    try {
        // Fetch the latest clients
        const rawClients: Clients = await getClients();

        const processedClients: Set<Erroneous> = flagger(rawClients);
        return processedClients;
    }
    catch (error) {
        console.error("When updating Guests:", error);
    }
    return undefined;
}

/**
 * Checks the clients from the form against the internal storage. Not the database. That is a different function and why this is a private helper.
 * @returns a record of the duplicates found in the form and the nonduplicates
 */
export function _checkForDuplicates(clientsPulledFromForm: Set<Erroneous>): { duplicates: Set<Erroneous>, nonDuplicates: Set<Erroneous> } {

    const duplicates: Set<Erroneous> = new Set();
    const nonDuplicates: Set<Erroneous> = new Set();

    clientsPulledFromForm.forEach((client) => {
        if (internalFormGuests.has(client)) {
            duplicates.add(client);
            console.log("Duplicate client found:", client);
        } else {
            nonDuplicates.add(client);
            console.log("New client added:", client);
        }
    });

    if (duplicates.size === 0) {
        console.log("No duplicates found");
    }
    if (nonDuplicates.size === 0) {
        console.log("No new clients added");
    }
    console.log(`Found ${duplicates.size} duplicates and ${nonDuplicates.size} non-duplicates.`);
    return { duplicates, nonDuplicates };
}

/**
 * Removes clients from the internalFormGuests that are older than the specified number of days.
 * @param days the number of days to keep clients in the internalFormGuests
 * @throws error if the days is not an integrer or is less than 0
 */
export async function _removeOldClients(days: number) {
    if (days < 0) {
        throw new Error("Days must be a non-negative integer");
    }
    if (!Number.isInteger(days)) {
        throw new Error("Days must be an integer");
    }
    const now = Date.now();
    internalFormGuests.forEach((client) => {
        if (!client.timestamp) {
            console.warn("Client does not have a timestamp, skipping removal check:", client);
            return;
        }
        if (now - client.timestamp > days * 24 * 60 * 60 * 1000) {
            internalFormGuests.delete(client);
        }
    });
}
