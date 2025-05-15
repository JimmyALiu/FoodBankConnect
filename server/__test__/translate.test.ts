// call getClients(), check that you can call convertClientsToFBM(clients: Clients) and that it makes working FBMGuests that can be added through /guests/add
import assert from "assert";
import { Clients } from '../src/intake_forms/custom_types';
import { FBMGuest } from "../routes/helper";
import { getClients } from "../src/intake_forms/client_intake";
import { convertClientsToFBM, convertAgeToDate } from "../src/intake_forms/translate_to_FBM";

test('translate client data to FBMGuest', async () => {
    const clients: Clients = await getClients();
    const result: FBMGuest[] = convertClientsToFBM(clients);

    result.forEach((guest, index) => {
        if (!guest.othersHousehold) {
            assert.ok(true, `Guest ${index} has no household members, skipping checks ✅`);
            return;
        }

        guest.othersHousehold.forEach((member, memberIndex) => {
            const ageRegex = /^\d{4}-\d{2}-\d{2}$/;
            assert.ok(
                ageRegex.test(member.age),
                `❌ Invalid age format for household member at index ${memberIndex} in guest ${index} with age ${member.age}`
            );
        });
    });
});



describe('convertAgeToDate', () => {
    const testCases = [
        { age: 25, expected: `${new Date().getFullYear() - 25}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` },
        { age: 0, expected: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` },
        { age: 100, expected: `${new Date().getFullYear() - 100}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` },
    ];

    testCases.forEach(({ age, expected }) => {
        it(`should convert age ${age} to date ${expected}`, () => {
            const result = convertAgeToDate(age);
            assert.strictEqual(result, expected, `Failed for age: ${age}`);
        });
    });
});