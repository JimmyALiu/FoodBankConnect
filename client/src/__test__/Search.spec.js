import { expect, test } from 'vitest'
import { parseSearchResponseData } from '../utils/utils'

test('parseSearchResponseData simple test - parse a search request with a single entry.', () => {
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


test('parseSearchResponseData complex test - parse a search request with a multiple entry.', () => {
    // entries
    const ID_1 = 1;
    const FIRST_NAME_1 = "first";
    const LAST_NAME_1 = "last";
    const PHONE_1 = "123";
    const ADDRESS_1 = "abc";
    const OTHERS_1 = "other";

    const ID_2 = 2;
    const FIRST_NAME_2 = "Jimmy";
    const LAST_NAME_2 = "Liu";
    const PHONE_2 = "3452";
    const ADDRESS_2 = "home";
    const OTHERS_2 = "none";


    const responseData = {
        results: [
            {
                id: ID_1,
                firstname: FIRST_NAME_1,
                lastname: LAST_NAME_1,
                phone: PHONE_1,
                street_address: ADDRESS_1,
                othersHousehold: OTHERS_1
            },
            {
                id: ID_2,
                firstname: FIRST_NAME_2,
                lastname: LAST_NAME_2,
                phone: PHONE_2,
                street_address: ADDRESS_2,
                othersHousehold: OTHERS_2
            }
        ],
    }

    const result = [
        {
            id: ID_1,
            firstname: FIRST_NAME_1,
            lastname: LAST_NAME_1,
            phone: PHONE_1,
            street_address: ADDRESS_1,
            othersHousehold: OTHERS_1
        },
        {
            id: ID_2,
            firstname: FIRST_NAME_2,
            lastname: LAST_NAME_2,
            phone: PHONE_2,
            street_address: ADDRESS_2,
            othersHousehold: OTHERS_2
        }
    ]

    // check with strict equality for objects
    expect(parseSearchResponseData(responseData)).toStrictEqual(result);
})
