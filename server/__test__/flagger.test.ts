import { _allRequiredFieldsThere, _requiredFieldsToFBM } from '../src/intake_forms/flagger';
import { copyErroneous, emptyErroneous, emptyFBMGuest, fieldMap, requiredFields } from '../src/intake_forms/custom_types';
import { mockClientComplete, mockClientMissingSomeRequiredNull, mockClientSomeRequiredEmpty, mockClientMissingAllRequiredNull, mockClientMissingAllRequiredEmptyString, mockClientMissingAllRequiredUndefined, onlyHeadOfHousehold, mockClientMissingOneRequiredNull } from './mock_clients';
import { Erroneous, Client } from '../src/intake_forms/custom_types';
import { FBMGuest } from '../routes/helper';
function createClient(fields: Record<string, any>): Map<string, any> {
    return new Map(Object.entries(fields));
}



describe.each([
    {
        name: 'empty erroneous object',
        erroneous: {
            FBMGuest: {} as FBMGuest,
            fields_invalid: new Set<string>(),
            fields_erroneous_n_description: new Map(),
            flags: {
                duplicate: false,
                severeAllergy: false,
                timestamp_missing: false,
                tenPlus: false,
                invalid: false,
                erroneous: false
            }
        },
        expected: {
            FBMGuest: {} as FBMGuest,
            fields_invalid: new Set(),
            fields_erroneous_n_description: new Map(),
            flags: {
                duplicate: false,
                severeAllergy: false,
                timestamp_missing: false,
                tenPlus: false,
                invalid: false,
                erroneous: false
            }
        }
    },
    {
        name: 'erroneous object with some fields',
        erroneous: {
            FBMGuest: {
                firstname: 'John',
                lastname: 'Doe',
                dob: '1990-01-01',
                city: 'City',
                zipcode: '12345',
                county: 'County',
                street_address: '123 Main St',
                household_total: 3,
                state: 'State',
                cf_guests_901d83d3c7: undefined,
                cf_guests_1fb4745f10: ['Provided'],
                cf_guests_45ae5f86e4: 'Out of County',
                cf_guests_8e6f172090: 'Small- 1 to 3',
                cf_guests_e8827ca4cf: '0'
            } as FBMGuest,
            fields_invalid: new Set<string>(['Timestamp', 'Head of Household First Name']),
            fields_erroneous_n_description: new Map([
                ['Timestamp', 'Invalid: Missing required field: Timestamp'],
                ['Head of Household First Name', 'Invalid: Missing required field: Head of Household First Name']
            ]),
            flags: {
                duplicate: true,
                severeAllergy: false,
                timestamp_missing: true,
                tenPlus: false,
                invalid: true,
                erroneous: true
            }
        },
        expected: {
            FBMGuest: {
                firstname: 'John',
                lastname: 'Doe',
                dob: '1990-01-01',
                city: 'City',
                zipcode: '12345',
                county: 'County',
                street_address: '123 Main St',
                household_total: 3,
                state: 'State',
                cf_guests_901d83d3c7: undefined,
                cf_guests_1fb4745f10: ['Provided'],
                cf_guests_45ae5f86e4: 'Out of County',
                cf_guests_8e6f172090: 'Small- 1 to 3',
                cf_guests_e8827ca4cf: '0'
            } as FBMGuest,
            fields_invalid: new Set(['Timestamp', 'Head of Household First Name']),
            fields_erroneous_n_description: new Map([
                ['Timestamp', 'Invalid: Missing required field: Timestamp'],
                ['Head of Household First Name', 'Invalid: Missing required field: Head of Household First Name']
            ]),
            flags: {
                duplicate: true,
                severeAllergy: false,
                timestamp_missing: true,
                tenPlus: false,
                invalid: true,
                erroneous: true
            }
        }
    },
    {
        name: 'erroneous object with all flags set to true',
        erroneous: {
            FBMGuest: {
                firstname: 'John',
                lastname: 'Doe',
                dob: '1990-01-01',
                city: 'City',
                zipcode: '12345',
                county: 'County',
                street_address: '123 Main St',
                household_total: 3,
                state: 'State',
                cf_guests_901d83d3c7: undefined,
                cf_guests_1fb4745f10: ['Provided'],
                cf_guests_45ae5f86e4: 'Out of County',
                cf_guests_8e6f172090: 'Small- 1 to 3',
                cf_guests_e8827ca4cf: '0'
            } as FBMGuest,
            fields_invalid: new Set<string>(['Head of Household Last Name']),
            fields_erroneous_n_description: new Map([
                ['Head of Household Last Name', 'Invalid: Missing required field: Head of Household Last Name']
            ]),
            flags: {
                duplicate: true,
                severeAllergy: true,
                timestamp_missing: true,
                tenPlus: true,
                invalid: true,
                erroneous: true
            }
        },
        expected: {
            FBMGuest: {
                firstname: 'John',
                lastname: 'Doe',
                dob: '1990-01-01',
                city: 'City',
                zipcode: '12345',
                county: 'County',
                street_address: '123 Main St',
                household_total: 3,
                state: 'State',
                cf_guests_901d83d3c7: undefined,
                cf_guests_1fb4745f10: ['Provided'],
                cf_guests_45ae5f86e4: 'Out of County',
                cf_guests_8e6f172090: 'Small- 1 to 3',
                cf_guests_e8827ca4cf: '0'
            } as FBMGuest,
            fields_invalid: new Set(['Head of Household Last Name']),
            fields_erroneous_n_description: new Map([
                ['Head of Household Last Name', 'Invalid: Missing required field: Head of Household Last Name']
            ]),
            flags: {
                duplicate: true,
                severeAllergy: true,
                timestamp_missing: true,
                tenPlus: true,
                invalid: true,
                erroneous: true
            }
        }
    }
])('copyErroneous - $name', ({ erroneous, expected }) => {
    it('returns a deep copy of the erroneous object', () => {
        const copied = copyErroneous(erroneous);
        expect(copied).toEqual(expected);
        expect(copied).not.toBe(erroneous); // Ensure it's a new object
        expect(copied.fields_invalid).not.toBe(erroneous.fields_invalid); // Ensure Set is copied
        expect(copied.fields_erroneous_n_description).not.toBe(erroneous.fields_erroneous_n_description); // Ensure Map is copied
        expect(copied.flags).not.toBe(erroneous.flags); // Ensure flags object is copied
    });
});



describe.each([
    {
        name: 'all required fields are present and non-empty',
        client: {
            'Timestamp': '2024-06-01T12:00:00Z',
            'Head of Household County:': 'County',
            'Head of Household First Name': 'John',
            'Head of Household Last Name': 'Doe',
            'Head of Household Date of Birth': '1990-01-01',
            'Head of Household City:': 'City',
            'Head of Household Zip code:': '12345',
            'Other than the Head of Household, how many people in their/your household?': '3'
        },
        expected: new Set()
    },
    {
        name: 'client is empty',
        client: new Set(),
        expected: new Set(Object.values(fieldMap))
    },
    {
        name: 'some required fields are missing',
        client: {
            'Timestamp': '2024-06-01T12:00:00Z',
            'Head of Household County:': 'County'
        },
        expected: new Set([
            fieldMap['Head of Household First Name'],
            fieldMap['Head of Household Last Name'],
            fieldMap['Head of Household Date of Birth'],
            fieldMap['Head of Household City:'],
            fieldMap['Head of Household Zip code:'],
            fieldMap['Other than the Head of Household, how many people in their/your household?']
        ])
    },
    {
        name: 'fields with empty string or null are missing',
        client: {
            'Timestamp': '',
            'Head of Household County:': null,
            'Head of Household First Name': 'John',
            'Head of Household Last Name': '',
            'Head of Household Date of Birth': '1990-01-01',
            'Head of Household City:': 'City',
            'Head of Household Zip code:': '12345',
            'Other than the Head of Household, how many people in their/your household?': ''
        },
        expected: new Set([
            fieldMap['Timestamp'],
            fieldMap['Head of Household County:'],
            fieldMap['Head of Household Last Name'],
            fieldMap['Other than the Head of Household, how many people in their/your household?']
        ])
    },
    {
        name: 'all present and non-empty (again)',
        client: {
            'Timestamp': '2024-06-01T12:00:00Z',
            'Head of Household County:': 'County',
            'Head of Household First Name': 'Jane',
            'Head of Household Last Name': 'Smith',
            'Head of Household Date of Birth': '1985-05-05',
            'Head of Household City:': 'Town',
            'Head of Household Zip code:': '54321',
            'Other than the Head of Household, how many people in their/your household?': '2'
        },
        expected: new Set()
    },

])('_allRequiredFieldsThere: $name', ({ client, expected }) => {
    const erroneousFields: Erroneous = emptyErroneous();
    it('returns the correct set of missing fields', () => {
        expect(_allRequiredFieldsThere(createClient(client), erroneousFields).fields_invalid).toEqual(expected);
    });
});



describe.each([
    {
        name: 'missing timestamp and invalid flag raised',
        client: {
            'Timestamp': '',
            'Head of Household County:': 'County',
            'Head of Household First Name': 'John',
            'Head of Household Last Name': 'Doe',
            'Head of Household Date of Birth': '1990-01-01',
            'Head of Household City:': 'City',
            'Head of Household Zip code:': '12345',
            'Other than the Head of Household, how many people in their/your household?': '3'
        },
        expectedInvalid: new Set<string>([fieldMap['Timestamp']]),
        expectedDescriptions: new Map<string, string>([
            [fieldMap['Timestamp'], 'Invalid: Missing required field: Timestamp']
        ]),
        expectedFlags: {
            invalid: true,
            timestamp_missing: true
        }
    },
    {
        name: 'multiple missing fields with invalid flag raised',
        client: {
            'Timestamp': '',
            'Head of Household County:': null,
            'Head of Household First Name': '',
            'Head of Household Last Name': '',
            'Head of Household Date of Birth': '1990-01-01',
            'Head of Household City:': '',
            'Head of Household Zip code:': '',
            'Other than the Head of Household, how many people in their/your household?': ''
        },
        expectedInvalid: new Set<string>([
            fieldMap['Timestamp'],
            fieldMap['Head of Household County:'],
            fieldMap['Head of Household First Name'],
            fieldMap['Head of Household Last Name'],
            fieldMap['Head of Household City:'],
            fieldMap['Head of Household Zip code:'],
            fieldMap['Other than the Head of Household, how many people in their/your household?']
        ]),
        expectedDescriptions: new Map<string, string>([
            [fieldMap['Timestamp'], 'Invalid: Missing required field: Timestamp'],
            [fieldMap['Head of Household County:'], 'Invalid: Missing required field: Head of Household County:'],
            [fieldMap['Head of Household First Name'], 'Invalid: Missing required field: Head of Household First Name'],
            [fieldMap['Head of Household Last Name'], 'Invalid: Missing required field: Head of Household Last Name'],
            [fieldMap['Head of Household City:'], 'Invalid: Missing required field: Head of Household City:'],
            [fieldMap['Head of Household Zip code:'], 'Invalid: Missing required field: Head of Household Zip code:'],
            [fieldMap['Other than the Head of Household, how many people in their/your household?'], 'Invalid: Missing required field: Other than the Head of Household, how many people in their/your household?']
        ]),
        expectedFlags: {
            invalid: true,
            timestamp_missing: true
        }
    },
    {
        name: 'all required fields present, no flags raised',
        client: {
            'Timestamp': '2024-06-01T12:00:00Z',
            'Head of Household County:': 'County',
            'Head of Household First Name': 'Jane',
            'Head of Household Last Name': 'Smith',
            'Head of Household Date of Birth': '1985-05-05',
            'Head of Household City:': 'Town',
            'Head of Household Zip code:': '54321',
            'Other than the Head of Household, how many people in their/your household?': '2'
        },
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: {
            invalid: false,
            timestamp_missing: false
        }
    }
])('_allRequiredFieldsThere - $name', ({ client, expectedInvalid, expectedDescriptions, expectedFlags }) => {
    let erroneousFields: Erroneous = emptyErroneous();
    test('produces correct erroneous fields and flags', () => {
        erroneousFields = _allRequiredFieldsThere(createClient(client), erroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.flags.timestamp_missing).toBe(expectedFlags.timestamp_missing);
    });
});



/**
 * Maps missing field names to FBM field names.
 * @param missingFields - A set of missing field names, can only be part of required fields
 * @returns A set of FBM field names.
 */
describe.each([
    {
        missingFields: new Set(['Head of Household First Name', 'Head of Household Last Name']),
        expected: new Set(['firstname', 'lastname'])
    },
    {
        missingFields: new Set([]),
        expected: new Set([])
    },
    {
        missingFields: new Set(['Head of Household Date of Birth']),
        expected: new Set(['dob'])
    },
    {
        missingFields: new Set(['Head of Household City:', 'Head of Household Zip code:', 'Head of Household County:']),
        expected: new Set(['city', 'zipcode', 'county'])
    },
    {
        missingFields: new Set(['Other than the Head of Household, how many people in their/your household?']),
        expected: new Set(['household_total'])
    },
    {
        missingFields: new Set([
            'Head of Household First Name',
            'Head of Household Last Name',
            'Head of Household Date of Birth',
            'Head of Household City:',
            'Head of Household Zip code:',
            'Head of Household County:',
            'Other than the Head of Household, how many people in their/your household?'
        ]),
        expected: new Set([
            'firstname',
            'lastname',
            'dob',
            'city',
            'zipcode',
            'county',
            'household_total'
        ])
    },
    {
        missingFields: new Set(['Unknown Field']), expected: new Set(),
        error: true
    } // This will throw an error
])('_requiredFieldsToFBM', ({ missingFields, expected, error }) => {
    it('returns the correct set of FBM field names', () => {
        if (error) {
            expect(() => _requiredFieldsToFBM(missingFields)).toThrow(Error);
            return;
        }
        expect(_requiredFieldsToFBM(missingFields)).toEqual(expected);

    });
});




describe.each([
    {
        name: 'no missing fields',
        client: mockClientComplete,
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
    },
    {
        name: 'missing timestamp',
        client: mockClientMissingOneRequiredNull,
        expectedInvalid: new Set<string>(['timestamp']),
        expectedDescriptions: new Map<string, string>([
            ['timestamp', 'Invalid: Missing required field: timestamp']
        ]),
    },
    {
        name: 'multiple missing fields',
        client: mockClientMissingSomeRequiredNull,
        expectedInvalid: new Set<string>(['timestamp', 'lastname', 'city', 'household_total']),
        expectedDescriptions: new Map<string, string>([
            ['timestamp', 'Invalid: Missing required field: timestamp'],
            ['lastname', 'Invalid: Missing required field: lastname'],
            ['city', 'Invalid: Missing required field: city'],
            ['household_total', 'Invalid: Missing required field: household_total'],
        ]),
    },
])(
    '_allRequiredFieldsThere - $name',
    ({ client, expectedInvalid, expectedDescriptions }) => {
        let erroneousFields: Erroneous = emptyErroneous();
        test('produces correct erroneous fields', () => {
            erroneousFields = _allRequiredFieldsThere(client, erroneousFields);

            expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
            //not testing the description, just that it exists
            expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
            expect([...erroneousFields.fields_erroneous_n_description.keys()]).toEqual([...expectedDescriptions.keys()]);
            expectedInvalid.forEach((field) => {
                expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
            });
        });
    }
);
