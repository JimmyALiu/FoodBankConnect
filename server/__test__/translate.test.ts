// call getClients(), check that you can call convertClientsToFBM(clients: Clients) and that it makes working FBMGuests that can be added through /guests/add
import assert from "assert";
import { Clients, headers } from '../src/intake_forms/custom_types';
import { FBMGuest, HouseholdMember } from "../routes/helper";
import { getClients } from "../src/intake_forms/client_intake";
import { convertClientsToFBM, convertAgeToDate } from "../src/intake_forms/translate_to_FBM";

test('translate client data to FBMGuest', async () => {
    const clients: Clients = await getClients();
    const result: FBMGuest[] = convertClientsToFBM(clients);

    describe('FBMGuest othersHousehold field 🏠', () => {
        result.forEach((guest, index) => {
            if (guest.othersHousehold) {
                guest.othersHousehold.forEach((member, memberIndex) => {
                    test(`FBMGuest[${index}].othersHousehold[${memberIndex}].age should be in 'yyyy-mm-dd' format 📅`, () => {
                        const ageRegex = /^\d{4}-\d{2}-\d{2}$/;
                        assert.ok(
                            ageRegex.test(member.age),
                            `❌ Invalid age format for household member at index ${memberIndex} in guest ${index}`
                        );
                    });
                });
            } else {
                test(`FBMGuest[${index}] has no othersHousehold field 🚫`, () => {
                    assert.ok(true, `Guest ${index} has no household members, skipping checks ✅`);
                });
            }
        });
    });
});



test('translate client data to FBMGuest', async () => {
    describe('convertAgeToDate', () => {
        const testCases = [
            { age: 25, expected: `${new Date().getFullYear() - 25}-01-01` },
            { age: 0, expected: `${new Date().getFullYear()}-01-01` },
            { age: 100, expected: `${new Date().getFullYear() - 100}-01-01` },
        ];

        testCases.forEach(({ age, expected }) => {
            test(`should convert age ${age} to date ${expected}`, () => {
                const result = convertAgeToDate(age);
                assert.strictEqual(result, expected, `Failed for age: ${age}`);
            });
        });
    });


});