//import { } from 'jest'; // Ensure Jest types are available
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { testSheet, getSheetData, naiveFamilyMemberIndexes, getFamilyMemberIndexes, findFamilyData, getClients, aggregateFamilyMemberData, removeEmptyStringsAndRows } from '../src/intake_forms/client_intake'; // Adjust the import path as necessary
import { Clients, headers } from '../src/intake_forms/custom_types';
import { describe, test, expect, beforeAll } from '@jest/globals';
import nock from 'nock';

beforeAll(() => {
    nock.cleanAll();
    nock.disableNetConnect();
    nock.enableNetConnect();
});

afterAll(() => {
    nock.restore(); // restore to default state
});

const __dirname: string = path.resolve();
// unmocked testing connection to google sheets
test('client intake test, spreadsheet connection working', async () => {
    //if .env file is not present, skip this test
    if (!fs.existsSync(path.resolve(__dirname, '../.env/food-bank-connect-b725637de6a2.json'))) {
        console.warn('Skipping test: .env file not found');
        return;
    }
    const result = await testSheet();
    expect(result).toBe(true);
});

test('getsheetdata test', async () => {
    //if .env file is not present, skip this test
    if (!fs.existsSync(path.resolve(__dirname, '../.env/food-bank-connect-b725637de6a2.json'))) {
        console.warn('Skipping test: .env file not found');
        return;
    }
    const result = await getSheetData();
    expect(result).toBeDefined();
});

test('get Clients data', async () => {
    //if .env file is not present, skip this test
    if (!fs.existsSync(path.resolve(__dirname, '../.env/food-bank-connect-b725637de6a2.json'))) {
        console.warn('Skipping test: .env file not found');
        return;
    }
    const result: Clients = await getClients();
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Set<Map<String, any>>);
    //check if there are any maps with all null fields in the set
    result?.forEach(async (client) => {
        expect(client).toBeInstanceOf(Map);
        expect(client.size).toBeGreaterThan(0);
        let count: number = 0;
        //check if all clients have the same keys
        expect(new Set(Array.from(client.keys()))).toEqual(headers);

        await client.forEach((value, key) => {
            //should be null or string
            expect(value).not.toEqual('');
            expect(value).not.toEqual(undefined);
            if (key === 'Timestamp' || key === 'Head of Household Date of Birth' || key === 'Head of Household Zip code:' || key === 'Head of Household City:' || key === 'Head of Household First Name' || key === 'Head of Household Last Name' || key === 'Other than the Head of Household, how many people in their/your household?' || key === 'Do you have a baby and want extra services?' || key === 'Head of Household County:') {
                expect(value).not.toEqual(null);
            }
            //check that no other fields are null
            if (value === null) {
                count++;
            }
        });
        //check to see that there are at least one null field than timestamp
        expect(count).not.toBe(client.size - 1);

    });
});



describe.each([
    {
        description: 'removes empty strings and rows with all empty values',
        clients: new Set([
            new Map([['Timestamp', 'John'], ['Last Name', 'Doe'], ['Age', '']]),
            new Map([['Timestamp', ''], ['Last Name', ''], ['Age', '']]),
            new Map([['Timestamp', 'Jane'], ['Last Name', 'Smith'], ['Age', '25']]),
        ]),
        expectedResult: new Set([
            new Map([['Timestamp', 'John'], ['Last Name', 'Doe'], ['Age', null]]),
            new Map([['Timestamp', 'Jane'], ['Last Name', 'Smith'], ['Age', '25']]),
        ]),
    },
    {
        description: 'handles empty set of clients',
        clients: new Set(),
        expectedResult: new Set(),
    },
    {
        description: 'removes rows with all empty values but keeps rows with at least one non-empty value',
        clients: new Set([
            new Map([['Timestamp', ''], ['Last Name', ''], ['Age', '']]),
            new Map([['Timestamp', 'Alice'], ['Last Name', ''], ['Age', '']]),
        ]),
        expectedResult: new Set([
            new Map([['Timestamp', 'Alice'], ['Last Name', null], ['Age', null]]),
        ]),
    },
    {
        description: 'does not modify rows with no empty strings',
        clients: new Set([
            new Map([['Timestamp', 'Bob'], ['Last Name', 'Brown'], ['Age', '40']]),
        ]),
        expectedResult: new Set([
            new Map([['Timestamp', 'Bob'], ['Last Name', 'Brown'], ['Age', '40']]),
        ]),
    },
    {
        description: 'converts empty strings to null but keeps rows with at least one non-empty value',
        clients: new Set([
            new Map([['Timestamp', 'Charlie'], ['Last Name', ''], ['Age', '50']]),
        ]),
        expectedResult: new Set([
            new Map([['Timestamp', 'Charlie'], ['Last Name', null], ['Age', '50']]),
        ]),
    },
])('$description', ({ clients, expectedResult }) => {
    test('removeEmptyStringsAndRows test', () => {
        expect(clients).toBeInstanceOf(Set);
        assert(clients instanceof Set);
        const typedClients: Clients = clients as Clients;
        const result = removeEmptyStringsAndRows(typedClients);

        expect(result).toBeInstanceOf(Set);
        if (result) {
            expect(result.size).toBe(expectedResult.size);
            expect(result).toEqual(expectedResult);
        }
    });
});




// test for naive family member indexes
describe.each([
    {
        description: 'basic 10 members',
        rawHeaders: ['1st member', '2nd member', '3rd member', '4th member', '5th member', '6th member', '7th member', '8th member', '9th member', '10th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]], ['4th member', [3]], ['5th member', [4]], ['6th member', [5]], ['7th member', [6]], ['8th member', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'uppercase 10 members',
        rawHeaders: ['1st MEMBER', '2nd memBER', '3rd memBEr', '4th membeR', '5th member', '6th member', '7th member', '8th member', '9th member', '10th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]], ['4th member', [3]], ['5th member', [4]], ['6th member', [5]], ['7th member', [6]], ['8th member', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'add one',
        rawHeaders: ['1st member', '2nd member', '3rd member', '4th member', '5th member', '6th member', '7th member', '8th member', '9th member', '10th member', '11th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]], ['4th member', [3]], ['5th member', [4]], ['6th member', [5]], ['7th member', [6]], ['8th member', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'add two extra non covered members',
        rawHeaders: ['1st member', '2nd member', '3rd member', '4th member', '5th member', '6th member', '7th member', '8th member', '9th member', '10th member', '11th member', '12th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]], ['4th member', [3]], ['5th member', [4]], ['6th member', [5]], ['7th member', [6]], ['8th member', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'records multiple instances of the same family member',
        rawHeaders: ['1st member jdjn', '1st member jdjn', '3rd memberdsf', '4th member of family', '3rd memberdsf', '6th memberwe', '7th member', '8th member sjn', '9th member', '10th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member jdjn', [0, 1]], ['3rd memberdsf', [2, 4]], ['4th member of family', [3]], ['6th memberwe', [5]], ['7th member', [6]], ['8th member sjn', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'no family members, empty array',
        rawHeaders: [],
        expectedResult: new Map<string, number[]>(
            [])
    },
    {
        description: 'no family members, wrong array',
        rawHeaders: ['cat', 'dog', 'fish'],
        expectedResult: new Map<string, number[]>(
            [])
    },
])('$description', ({ rawHeaders, expectedResult }) => {
    test('naiveFamilyMemberIndex test', async () => {
        // Add your test logic here using rawHeaders and expectedResult
        expect(rawHeaders).toBeDefined();
        expect(expectedResult).toBeDefined();
        const result = naiveFamilyMemberIndexes(rawHeaders);
        //check if the result is a map
        expect(result).toBeInstanceOf(Map);
        //check if the result is a map with the same size as expected result
        expect(result.size).toBe(expectedResult.size);
        //check if the result has the same keys as expected result
        expectedResult.forEach((value, key) => {
            expect(result.has(key)).toBe(true);
            expect(result.get(key)).toEqual(value);
        });
    });
});



// test for abstract family member indexes
describe.each([
    {
        description: 'basic 10 members',
        rawHeaders: ['1st member', '2nd member', '3rd member', '4th member', '5th member', '6th member', '7th member', '8th member', '9th member', '10th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]], ['4th member', [3]], ['5th member', [4]], ['6th member', [5]], ['7th member', [6]], ['8th member', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'add one',
        rawHeaders: ['1st member', '2nd member', '3rd member', '4th member', '5th member', '6th member', '7th member', '8th member', '9th member', '10th member', '11th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]], ['4th member', [3]], ['5th member', [4]], ['6th member', [5]], ['7th member', [6]], ['8th member', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'add two extra non covered members',
        rawHeaders: ['1st member', '2nd member', '3rd member', '4th member', '5th member', '6th member', '7th member', '8th member', '9th member', '10th member', '11th member', '12th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]], ['4th member', [3]], ['5th member', [4]], ['6th member', [5]], ['7th member', [6]], ['8th member', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'records multiple instances of the same family member',
        rawHeaders: ['1st member jdjn', '1st member jdjn', '3rd memberdsf', '4th member of family', '3rd memberdsf', '6th memberwe', '7th member', '8th member sjn', '9th member', '10th member'],
        expectedResult: new Map<string, number[]>([
            ['1st member jdjn', [0, 1]], ['3rd memberdsf', [2, 4]], ['4th member of family', [3]], ['6th memberwe', [5]], ['7th member', [6]], ['8th member sjn', [7]], ['9th member', [8]], ['10th member', [9]]
        ])
    },
    {
        description: 'no family members, empty array',
        rawHeaders: [],
        expectedResult: new Map<string, number[]>(
            [])
    },
    {
        description: 'no family members, wrong array',
        rawHeaders: ['cat', 'dog', 'fish'],
        expectedResult: new Map<string, number[]>(
            [])
    },
])('$description', ({ rawHeaders, expectedResult }) => {
    test('abstract toplevel FamilyMemberIndex test', async () => {
        // Add your test logic here using rawHeaders and expectedResult
        expect(rawHeaders).toBeDefined();
        expect(expectedResult).toBeDefined();
        const result = await getFamilyMemberIndexes(rawHeaders);
        //check if the result is a map
        expect(result).toBeInstanceOf(Map);
        //check if the result is a map with the same size as expected result
        expect(result.size).toBe(expectedResult.size);
        //check if the result has the same keys as expected result
        expectedResult.forEach((value, key) => {
            expect(result.has(key)).toBe(true);
            expect(result.get(key)).toEqual(value);
        });
    });
});

const empty = new Map<string, number>();
empty.set('1st member', 0);
empty.delete('1st member');

// Additional tests for findFamilyData function
describe.each([
    {
        description: 'valid family member data with single column filled',
        familyMemberIndexes: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]]
        ]),
        rows: [
            ['John', '', ''],
            ['', 'Doe', ''],
            ['', '', 'Smith']
        ],
        expectedResult: [
            new Map<string, any>([['1st member', 0], ['2nd member', -1], ['3rd member', -1]]),
            new Map<string, any>([['1st member', -1], ['2nd member', 1], ['3rd member', -1]]),
            new Map<string, any>([['1st member', -1], ['2nd member', -1], ['3rd member', 2]])
        ]
    },
    {
        description: 'valid family member data fully filled',
        familyMemberIndexes: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]], ['3rd member', [2]]
        ]),
        rows: [
            ['John', 'a', 's'],
            ['d', 'Doe', 'as'],
            ['as', 'sas', 'Smith']
        ],
        expectedResult: [
            new Map<string, number>([['1st member', 0], ['2nd member', 1], ['3rd member', 2]]),
            new Map<string, number>([['1st member', 0], ['2nd member', 1], ['3rd member', 2]]),
            new Map<string, number>([['1st member', 0], ['2nd member', 1], ['3rd member', 2]])
        ]
    },
    {
        description: 'valid family member data with two first member columns',
        familyMemberIndexes: new Map<string, number[]>([
            ['1st member', [0, 1]], ['2nd member', [2]]
        ]),
        rows: [
            ['John', '', 'ss'],
            ['', 'Doe', 'ss'],
            ['eep', '', 'Smith']
        ],
        expectedResult: [
            new Map<string, number>([['1st member', 0], ['2nd member', 2]]),
            new Map<string, number>([['1st member', 1], ['2nd member', 2]]),
            new Map<string, number>([['1st member', 0], ['2nd member', 2]])
        ]
    },
    {
        description: 'multiple columns filled for a single row',
        familyMemberIndexes: new Map<string, number[]>([
            ['1st member', [0, 1]], ['2nd member', [2]]
        ]),
        rows: [
            ['John', 'Doe', ''],
            ['', '', 'Smith']
        ],
        expectedError: true
    },
    {
        description: 'empty rows shouldnt matter',
        familyMemberIndexes: new Map<string, number[]>([
            ['1st member', [0]], ['2nd member', [1]]
        ]),
        rows: [
            ['', ''],
            ['', '']
        ],
        expectedResult: [
            new Map<string, any>([['1st member', -1], ['2nd member', -1]]),
            new Map<string, any>([['1st member', -1], ['2nd member', -1]])
        ]
    },
    {
        description: 'no family member indexes',
        familyMemberIndexes: new Map<string, number[]>(),
        rows: [
            ['John', 'Doe'],
            ['Jane', 'Smith']
        ],
        expectedResult: [empty, empty]
    }
])('$description', ({ familyMemberIndexes, rows, expectedResult, expectedError }) => {
    test('findFamilyData test', () => {
        if (expectedError) {
            expect(() => findFamilyData(familyMemberIndexes, rows)).toThrow();
        } else {
            const result = findFamilyData(familyMemberIndexes, rows);
            expect(result).toEqual(expectedResult);
        }
    });
});



describe.each([
    {
        description: 'giant 9x9 rows with arbitrary headings',
        rows: [
            ['John', 'Doe', '30', 'Male', '123 Main St', 'City', 'State', '12345', 'USA'],
            ['Jane', 'Smith', '25', 'Female', '456 Elm St', 'Town', 'Province', '67890', 'Canada'],
            ['Alice', 'Johnson', '40', 'Female', '789 Oak St', 'Village', 'Region', '11223', 'UK'],
            ['Bob', 'Brown', '35', 'Male', '321 Pine St', 'Hamlet', 'County', '44556', 'Australia'],
            ['Charlie', 'Davis', '50', 'Male', '654 Maple St', 'Borough', 'District', '77889', 'India'],
            ['Diana', 'Evans', '28', 'Female', '987 Birch St', 'City', 'State', '99001', 'Germany'],
            ['Eve', 'Wilson', '22', 'Female', '543 Cedar St', 'Town', 'Province', '33445', 'France'],
            ['Frank', 'Taylor', '60', 'Male', '876 Spruce St', 'Village', 'Region', '66778', 'Italy'],
            ['Grace', 'Harris', '45', 'Female', '210 Walnut St', 'Hamlet', 'County', '88990', 'Spain']
        ],
        rawHeaders: [
            'First Name', 'Last Name', 'Age', 'Gender', 'Address', 'City', 'State/Province', 'Postal Code', 'Country'
        ],
        expectedResult: new Set([
            new Map([
                ['First Name', 'John'], ['Last Name', 'Doe'], ['Age', '30'], ['Gender', 'Male'],
                ['Address', '123 Main St'], ['City', 'City'], ['State/Province', 'State'],
                ['Postal Code', '12345'], ['Country', 'USA']
            ]),
            new Map([
                ['First Name', 'Jane'], ['Last Name', 'Smith'], ['Age', '25'], ['Gender', 'Female'],
                ['Address', '456 Elm St'], ['City', 'Town'], ['State/Province', 'Province'],
                ['Postal Code', '67890'], ['Country', 'Canada']
            ]),
            new Map([
                ['First Name', 'Alice'], ['Last Name', 'Johnson'], ['Age', '40'], ['Gender', 'Female'],
                ['Address', '789 Oak St'], ['City', 'Village'], ['State/Province', 'Region'],
                ['Postal Code', '11223'], ['Country', 'UK']
            ]),
            new Map([
                ['First Name', 'Bob'], ['Last Name', 'Brown'], ['Age', '35'], ['Gender', 'Male'],
                ['Address', '321 Pine St'], ['City', 'Hamlet'], ['State/Province', 'County'],
                ['Postal Code', '44556'], ['Country', 'Australia']
            ]),
            new Map([
                ['First Name', 'Charlie'], ['Last Name', 'Davis'], ['Age', '50'], ['Gender', 'Male'],
                ['Address', '654 Maple St'], ['City', 'Borough'], ['State/Province', 'District'],
                ['Postal Code', '77889'], ['Country', 'India']
            ]),
            new Map([
                ['First Name', 'Diana'], ['Last Name', 'Evans'], ['Age', '28'], ['Gender', 'Female'],
                ['Address', '987 Birch St'], ['City', 'City'], ['State/Province', 'State'],
                ['Postal Code', '99001'], ['Country', 'Germany']
            ]),
            new Map([
                ['First Name', 'Eve'], ['Last Name', 'Wilson'], ['Age', '22'], ['Gender', 'Female'],
                ['Address', '543 Cedar St'], ['City', 'Town'], ['State/Province', 'Province'],
                ['Postal Code', '33445'], ['Country', 'France']
            ]),
            new Map([
                ['First Name', 'Frank'], ['Last Name', 'Taylor'], ['Age', '60'], ['Gender', 'Male'],
                ['Address', '876 Spruce St'], ['City', 'Village'], ['State/Province', 'Region'],
                ['Postal Code', '66778'], ['Country', 'Italy']
            ]),
            new Map([
                ['First Name', 'Grace'], ['Last Name', 'Harris'], ['Age', '45'], ['Gender', 'Female'],
                ['Address', '210 Walnut St'], ['City', 'Hamlet'], ['State/Province', 'County'],
                ['Postal Code', '88990'], ['Country', 'Spain']
            ])
        ])
    },
    {
        description: 'one row with arbitrary headings',
        rows: [
            ['John', 'Doe', '30', 'Male', '123 Main St', 'City', 'State', '12345', 'USA'],
        ],
        rawHeaders: [
            'First Name', 'Last Name', 'Age', 'Gender', 'Address', 'City', 'State/Province', 'Postal Code', 'Country'
        ],
        expectedResult: new Set([
            new Map([
                ['First Name', 'John'], ['Last Name', 'Doe'], ['Age', '30'], ['Gender', 'Male'],
                ['Address', '123 Main St'], ['City', 'City'], ['State/Province', 'State'],
                ['Postal Code', '12345'], ['Country', 'USA']
            ]),
        ])
    },
    {
        description: '0 rows',
        rows: [
        ],
        rawHeaders: [
        ],
        expectedResult: new Set([
            empty
        ])
    },
    {
        description: '2 rows with arbitrary headings',
        rows: [
            ['John', 'Doe', '30', 'Male', '123 Main St', 'City', 'State', '12345', 'USA'],
            ['Jane', 'Smith', '25', 'Female', '456 Elm St', 'Town', 'Province', '67890', 'Canada'],
        ],
        rawHeaders: [
            'First Name', 'Last Name', 'Age', 'Gender', 'Address', 'City', 'State/Province', 'Postal Code', 'Country'
        ],
        expectedResult: new Set([
            new Map([
                ['First Name', 'John'], ['Last Name', 'Doe'], ['Age', '30'], ['Gender', 'Male'],
                ['Address', '123 Main St'], ['City', 'City'], ['State/Province', 'State'],
                ['Postal Code', '12345'], ['Country', 'USA']
            ]),
            new Map([
                ['First Name', 'Jane'], ['Last Name', 'Smith'], ['Age', '25'], ['Gender', 'Female'],
                ['Address', '456 Elm St'], ['City', 'Town'], ['State/Province', 'Province'],
                ['Postal Code', '67890'], ['Country', 'Canada']
            ]),
        ]
        )
    },
    {
        description: 'empty rows with empty headers',
        rows: [
            [''],
        ],
        rawHeaders: [
            'g'
        ],
        expectedResult: new Set([
            new Map([
                ['g', '']
            ]),
        ]
        )
    },
    {
        description: 'throws error on mismatched headers and rows length, 3 versus 1',
        rows: [
            ['John', 'Doe', '30'],],
        rawHeaders: [
            ''
        ],
        expectedError: true,
    },
    {
        description: 'throws error on mismatched headers and rows length, 2 versus 4',
        rows: [
            ['John', 'Doe'], ['drink', 'water']],
        rawHeaders: [
            'name', 'age', 'drink', 'water'
        ],
        expectedResult: new Set([
            new Map([['name', 'John'], ['age', 'Doe'], ['drink', null], ['water', null]]),
            new Map([['name', 'drink'], ['age', 'water'], ['drink', null], ['water', null]])])
    },
    {
        description: 'throws error on matching headers smaller than data',
        rows: [
            ['John', 'Doe', 'drink', 'water']],
        rawHeaders: [
            'John', 'Doe'
        ],
        expectedError: true,
    },
    {
        description: 'throws error on matching rows 0 and headers, common issue',
        rows: [
            ['John', 'Doe'], ['drink', 'water']],
        rawHeaders: [
            'John', 'Doe'
        ],
        expectedError: true,
    },
    // {
    //     description: 'has an empty row right after the header',
    //     rows: [[null, null, null, null, null, null, null, null, null], ['John', 'Doe', '30', '15', '123 Main St', 'City', 'State', '12345', 'USA']],
    //     rawHeaders: ['First Name', 'Last Name', 'Age', 'bar', 'Address', 'City', 'State/Province', 'Postal Code', 'Country'],
    //     expectedResult: new Set([
    //         new Map([['First Name', null], ['Last Name', null], ['Age', null], ['bar', null],
    //         ['Address', null], ['City', null], ['State/Province', null], ['Postal Code', null], ['Country', null]]),
    //         new Map([
    //             ['First Name', 'John'], ['Last Name', 'Doe'], ['Age', '30'], ['bar', '15'],
    //             ['Address', '123 Main St'], ['City', 'City'], ['State/Province', 'State'],
    //             ['Postal Code', '12345'], ['Country', 'USA']
    //         ]),
    //     ])

    // },
    {
        description: 'has an empty row right after the header',
        rows: [['', '', '', '', '', '', '', '', ''], ['John', 'Doe', '30', '15', '123 Main St', 'City', 'State', '12345', 'USA']],
        rawHeaders: ['First Name', 'Last Name', 'Age', 'bar', 'Address', 'City', 'State/Province', 'Postal Code', 'Country'],
        expectedResult: new Set([
            new Map([
                ['First Name', ''], ['Last Name', ''], ['Age', ''], ['bar', ''],
                ['Address', ''], ['City', ''], ['State/Province', ''], ['Postal Code', ''], ['Country', '']
            ]),
            new Map([
                ['First Name', 'John'], ['Last Name', 'Doe'], ['Age', '30'], ['bar', '15'],
                ['Address', '123 Main St'], ['City', 'City'], ['State/Province', 'State'],
                ['Postal Code', '12345'], ['Country', 'USA']
            ]),
        ])

    },
    {
        description: 'ignores columns with empty headers',
        rows: [
            ['John', 'Doe', '30', 'Male', '123 Main St', 'City', 'State', '12345', 'USA']
        ],
        rawHeaders: [
            'First Name', 'Last Name', '', 'Gender', 'Address', '', 'State/Province', 'Postal Code', 'Country'
        ],
        expectedResult: new Set([
            new Map([
                ['First Name', 'John'], ['Last Name', 'Doe'], ['Gender', 'Male'],
                ['Address', '123 Main St'], ['State/Province', 'State'],
                ['Postal Code', '12345'], ['Country', 'USA']
            ])
        ])
    },
    // {
    //     description: 'has an empty row right after the header',
    //     rows: [[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], ['John', 'Doe', '30', '15', '123 Main St', 'City', 'State', '12345', 'USA']],
    //     rawHeaders: ['First Name', 'Last Name', 'Age', 'bar', 'Address', 'City', 'State/Province', 'Postal Code', 'Country'],
    //     expectedResult: new Set([
    //         new Map([
    //             ['First Name', undefined], ['Last Name', undefined], ['Age', undefined], ['bar', undefined],
    //             ['Address', undefined], ['City', undefined], ['State/Province', undefined], ['Postal Code', undefined], ['Country', undefined]
    //         ]),
    //         new Map([
    //             ['First Name', 'John'], ['Last Name', 'Doe'], ['Age', '30'], ['bar', '15'],
    //             ['Address', '123 Main St'], ['City', 'City'], ['State/Province', 'State'],
    //             ['Postal Code', '12345'], ['Country', 'USA']
    //         ]),
    //     ])
    // }



])('$description', ({ rows, rawHeaders, expectedResult, expectedError }) => {
    test('convert rows into clients', () => {

        if (expectedError) {
            expect(() => aggregateFamilyMemberData(rawHeaders, rows)).toThrow();
        } else {
            const result: Clients = aggregateFamilyMemberData(rawHeaders, rows);

            // Ensure result is a Set
            expect(result).toBeInstanceOf(Set);
            if (result && expectedResult) {
                // Ensure result contains the same number of clients as rows
                expect(result.size).toBe(expectedResult.size);

                // Ensure no data is lost
                expect(result).toEqual(expectedResult);
            } else {
                //should fail if result is null or undefined
                expect(result).toBeDefined();
            }
        }
    });
});