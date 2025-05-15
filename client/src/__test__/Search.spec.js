import { expect, test } from 'vitest'
import { parseSearchResponseData } from '../utils/utils.ts'

test('Test the helper function to parse the server response for a search request.', () => {
    // entry
    const ID = 1;
    const FIRST_NAME = "first";
    const LAST_NAME = "last";
    const PHONE = "123";
    const ADDRESS = "abc";
    const OTHERS = "other";
    const responseData = {
        results: [{
            id: ID,
            firstname: FIRST_NAME,
            lastname: LAST_NAME,
            phone: PHONE,
            street_address: ADDRESS,
            othersHousehold: OTHERS
        }],
    }

    const result = [
        {
            id: ID,
            firstname: FIRST_NAME,
            lastname: LAST_NAME,
            phone: PHONE,
            street_address: ADDRESS,
            othersHousehold: OTHERS
        },
    ]

    // check with strict equality for objects
    expect(parseSearchResponseData(responseData)).toStrictEqual(result);
})
