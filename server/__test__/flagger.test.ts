import { _allRequiredFieldsThere, _checkTrueHouseholdSize, _requiredFieldsToFBM, isHeadOfHouseholdMember, isMemberMissingImportantField, isValidAcknowledgment, isValidAllergies, isValidApartment, isValidBabyFood, isValidBabyFormula, isValidBabyServices, isValidCatFood, isValidCity, isValidCounty, isValidDateOfBirth, isValidDiaperSize, isValidDietaryInformation, isValidDogFood, isValidEthnicFoodPreference, isValidFirstName, isValidFoodModification, isValidHouseholdMembers, isValidHouseholdSize, isValidHouseNumber, isValidLastName, isValidLifeThreateningAllergy, isValidMeatPreference, isValidMemberAge, isValidMemberFirstName, isValidMemberLastName, isValidStreet, isValidTimestamp, isValidZipCode } from '../src/intake_forms/flagger';
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
                erroneous: false,
                hohInMembers: false
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
                erroneous: false,
                hohInMembers: false
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
                erroneous: true,
                hohInMembers: false
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
                erroneous: true,
                hohInMembers: false
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
                erroneous: true,
                hohInMembers: true
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
                erroneous: true,
                hohInMembers: true
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
        expected: new Set(['timestamp', 'county', 'firstname', 'lastname', 'dob', 'city', 'zipcode', 'household_total'])
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

describe.each([
    {
        name: 'valid timestamp',
        timestamp: '2023-10-01T12:00:00Z',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: {
            invalid: false,
        }
    },
    {
        name: 'null timestamp',
        timestamp: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['Timestamp']),
        expectedDescriptions: new Map<string, string>([
            ['Timestamp', 'Invalid: Missing or empty timestamp.']
        ]),
        expectedFlags: {
            invalid: true,
        }
    },
    {
        name: 'empty timestamp',
        timestamp: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['Timestamp']),
        expectedDescriptions: new Map<string, string>([
            ['Timestamp', 'Invalid: Missing or empty timestamp.']
        ]),
        expectedFlags: {
            invalid: true,
        }
    },
    {
        name: 'whitespace timestamp',
        timestamp: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['Timestamp']),
        expectedDescriptions: new Map<string, string>([
            ['Timestamp', 'Invalid: Missing or empty timestamp.']
        ]),
        expectedFlags: {
            invalid: true,
        }
    },
    {
        name: 'invalid date format',
        timestamp: 'invalid-date',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['Timestamp']),
        expectedDescriptions: new Map<string, string>([
            ['Timestamp', 'Invalid: Timestamp is not a valid date.']
        ]),
        expectedFlags: {
            invalid: true,
        }
    },
    {
        name: 'timestamp in the future',
        timestamp: '3023-10-01T12:00:00Z',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['Timestamp']),
        expectedDescriptions: new Map<string, string>([
            ['Timestamp', 'Invalid: Timestamp is in the future.']
        ]),
        expectedFlags: {
            invalid: true,
        }
    }
])('isValidTimestamp - $name', ({ timestamp, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidTimestamp(timestamp, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest).toEqual(inputErroneousFields.FBMGuest); // Ensure FBMGuest is preserved
    });
});

describe.each([
    {
        name: 'valid name',
        firstName: 'John',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: {
            invalid: false,
        },
        expectedFBMGuestname: 'John'
    },
    {
        name: 'null name',
        firstName: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['lastname']),
        expectedDescriptions: new Map<string, string>([
            ['lastname', 'Invalid: Missing or empty name.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: ''
    },
    {
        name: 'empty name',
        firstName: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['lastname']),
        expectedDescriptions: new Map<string, string>([
            ['lastname', 'Invalid: Missing or empty name.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: ''
    },
    {
        name: 'whitespace name',
        firstName: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['lastname']),
        expectedDescriptions: new Map<string, string>([
            ['lastname', 'Invalid: Missing or empty name.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: ''
    },
    {
        name: 'name with only punctuation',
        firstName: '!!!',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['lastname']),
        expectedDescriptions: new Map<string, string>([
            ['lastname', 'Invalid: LastName contains only punctuation.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: '!!!'
    },
    {//might have non ascii characters for some languages
        name: 'name with mixed valid characters and punctuation',
        firstName: 'John!',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: {
            invalid: false,
        },
        expectedFBMGuestname: 'John!'
    }
])('isValidLastName - $name', ({ firstName, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestname }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidLastName(firstName, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.lastname).toEqual(expectedFBMGuestname); // Ensure FBMGuest name is set correctly
    });
});

describe.each([
    {
        name: 'valid name',
        firstName: 'John',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: {
            invalid: false,
        },
        expectedFBMGuestname: 'John'
    },
    {
        name: 'null name',
        firstName: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['firstname']),
        expectedDescriptions: new Map<string, string>([
            ['firstname', 'Invalid: Missing or empty name.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: ''
    },
    {
        name: 'empty name',
        firstName: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['firstname']),
        expectedDescriptions: new Map<string, string>([
            ['firstname', 'Invalid: Missing or empty name.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: ''
    },
    {
        name: 'whitespace name',
        firstName: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['firstname']),
        expectedDescriptions: new Map<string, string>([
            ['firstname', 'Invalid: Missing or empty name.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: ''
    },
    {
        name: 'name with only punctuation',
        firstName: '!!!',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['firstname']),
        expectedDescriptions: new Map<string, string>([
            ['firstname', 'Invalid: Name contains only punctuation.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestname: '!!!'
    },
    {//might have non ascii characters for some languages
        name: 'name with mixed valid characters and punctuation',
        firstName: 'John!',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: {
            invalid: false,
        },
        expectedFBMGuestname: 'John!'
    }
])('isValidFirstName - $name', ({ firstName, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestname }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidFirstName(firstName, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.firstname).toBe(expectedFBMGuestname); // Ensure FBMGuest name is set correctly
    });
});
describe.each([
    {
        name: 'valid date of birth',
        dob: '1990-01-01',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: {
            invalid: false,
        },
        expectedFBMGuestdob: '1990-01-01'
    },
    {
        name: 'null date of birth',
        dob: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dob']),
        expectedDescriptions: new Map<string, string>([
            ['dob', 'Invalid: Missing or empty date of birth.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestdob: ''
    },
    {
        name: 'empty date of birth',
        dob: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dob']),
        expectedDescriptions: new Map<string, string>([
            ['dob', 'Invalid: Missing or empty date of birth.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestdob: ''
    },
    {
        name: 'whitespace date of birth',
        dob: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dob']),
        expectedDescriptions: new Map<string, string>([
            ['dob', 'Invalid: Missing or empty date of birth.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestdob: ''
    },
    {
        name: 'invalid date format',
        dob: 'invalid-date',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dob']),
        expectedDescriptions: new Map<string, string>([
            ['dob', 'Invalid: Date of birth is not a valid date.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestdob: 'invalid-date'
    },
    {
        name: 'date of birth over 150 years old',
        dob: '1800-01-01',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dob']),
        expectedDescriptions: new Map<string, string>([
            ['dob', 'Invalid: Date of birth is over 150 years old.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestdob: '1800-01-01'
    },
    {
        name: 'date of birth in the future',
        dob: '3023-01-01',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dob']),
        expectedDescriptions: new Map<string, string>([
            ['dob', 'Invalid: Date of birth is in the future.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestdob: '3023-01-01'
    },
    {
        name: 'date of birth with invalid negative format',
        dob: '-2002-01-01',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dob']),
        expectedDescriptions: new Map<string, string>([
            ['dob', 'Invalid: Date of birth is not in the YYYY-MM-DD format.']
        ]),
        expectedFlags: {
            invalid: true,
        },
        expectedFBMGuestdob: '-2002-01-01'
    }
])('isValidDateOfBirth - $name', ({ dob, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestdob }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidDateOfBirth(dob, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.dob).toEqual(expectedFBMGuestdob); // Ensure FBMGuest date of birth is set correctly   
    });
});

describe.each([
    {
        name: 'valid street',
        street: '123 Main St',
        inputErroneousFields: emptyErroneous(),
        expectedStreet: '123 Main St',
    },
    {
        name: 'street with punctuation',
        street: '123 Main St!!!',
        inputErroneousFields: emptyErroneous(),
        expectedStreet: '123 Main St!!!',
    },
    {
        name: 'null street',
        street: null,
        inputErroneousFields: emptyErroneous(),
        expectedStreet: '',
    },
    {
        name: 'empty street',
        street: '',
        inputErroneousFields: emptyErroneous(),
        expectedStreet: '',
    },
    {
        name: 'whitespace street',
        street: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedStreet: '',
    },
])('isValidStreet - $name', ({ street, inputErroneousFields, expectedStreet }) => {
    it('produces correct cleaned-up street', () => {
        const { erroneousFields, street: cleanedStreet } = isValidStreet(street, inputErroneousFields);
        expect(cleanedStreet).toBe(expectedStreet);
        expect(erroneousFields).toEqual(inputErroneousFields); // Ensure erroneous fields are unchanged
    });
});

describe.each([
    {
        name: 'valid house number',
        houseNumber: '123',
        inputErroneousFields: emptyErroneous(),
        expectedHouseNumber: '123',
    },
    {
        name: 'house number with letters',
        houseNumber: '123A',
        inputErroneousFields: emptyErroneous(),
        expectedHouseNumber: '123A',
    },
    {
        name: 'null house number',
        houseNumber: null,
        inputErroneousFields: emptyErroneous(),
        expectedHouseNumber: '',
    },
    {
        name: 'empty house number',
        houseNumber: '',
        inputErroneousFields: emptyErroneous(),
        expectedHouseNumber: '',
    },
    {
        name: 'whitespace house number',
        houseNumber: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedHouseNumber: '',
    },
])('isValidHouseNumber - $name', ({ houseNumber, inputErroneousFields, expectedHouseNumber }) => {
    it('produces correct cleaned-up house number', () => {
        const { erroneousFields, houseNumber: cleanedHouseNumber } = isValidHouseNumber(houseNumber, inputErroneousFields);
        expect(cleanedHouseNumber).toBe(expectedHouseNumber);
        expect(erroneousFields).toEqual(inputErroneousFields); // Ensure erroneous fields are unchanged
    });
});

describe.each([
    {
        name: 'valid apartment number',
        apt: 'Apt 101',
        inputErroneousFields: emptyErroneous(),
        expectedApartment: 'Apt 101',
    },
    {
        name: 'apartment number with punctuation',
        apt: 'Apt 101!!!',
        inputErroneousFields: emptyErroneous(),
        expectedApartment: 'Apt 101!!!',
    },
    {
        name: 'null apartment number',
        apt: null,
        inputErroneousFields: emptyErroneous(),
        expectedApartment: undefined,
    },
    {
        name: 'empty apartment number',
        apt: '',
        inputErroneousFields: emptyErroneous(),
        expectedApartment: undefined,
    },
    {
        name: 'whitespace apartment number',
        apt: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedApartment: undefined,
    },
])('isValidApartment - $name', ({ apt, inputErroneousFields, expectedApartment }) => {
    it('produces correct cleaned-up apartment number', () => {
        const erroneousFields = isValidApartment(apt, inputErroneousFields);
        expect(erroneousFields.FBMGuest.apartment).toBe(expectedApartment);
        expect(erroneousFields.fields_invalid.size).toBe(0); // Ensure no invalid fields are added
    });
});

describe.each([
    {
        name: 'valid city',
        city: 'Seattle',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false },
        expectedFBMGuestCity: 'Seattle'
    },
    {
        name: 'null city',
        city: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['city']),
        expectedDescriptions: new Map<string, string>([
            ['city', 'Invalid: Missing or empty city.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestCity: ''
    },
    {
        name: 'empty city',
        city: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['city']),
        expectedDescriptions: new Map<string, string>([
            ['city', 'Invalid: Missing or empty city.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestCity: ''
    },
    {
        name: 'city with only punctuation',
        city: '!!!',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['city']),
        expectedDescriptions: new Map<string, string>([
            ['city', 'Invalid: City contains only punctuation.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestCity: '!!!'
    }
])('isValidCity - $name', ({ city, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestCity }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidCity(city, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.city).toBe(expectedFBMGuestCity);
    });
});

describe.each([
    {
        name: 'valid zip code',
        zip: '98101',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false },
        expectedFBMGuestZip: '98101'
    },
    {
        name: 'null zip code',
        zip: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['zipcode']),
        expectedDescriptions: new Map<string, string>([
            ['zipcode', 'Invalid: Missing or empty zip code.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestZip: ''
    },
    {
        name: 'zip code with non-digit characters',
        zip: '98A01',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['zipcode']),
        expectedDescriptions: new Map<string, string>([
            ['zipcode', 'Invalid: Zip code must be 5 digits long.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestZip: '9801'
    },
    {
        name: '9-digit zip code',
        zip: '981012345',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['zipcode']),
        expectedDescriptions: new Map<string, string>([
            ['zipcode', 'Potentially erroneous: 9-digit zip codes may represent postal codes.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestZip: '981012345'
    }
])('isValidZipCode - $name', ({ zip, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestZip }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidZipCode(zip, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.zipcode).toBe(expectedFBMGuestZip);
    });
});

describe.each([
    {
        name: 'valid county',
        county: 'King',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false },
        expectedFBMGuestCounty: 'King'
    },
    {
        name: 'null county',
        county: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['Head of Household County:']),
        expectedDescriptions: new Map<string, string>([
            ['Head of Household County:', 'Invalid: Missing or empty county.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestCounty: ''
    },
    {
        name: 'county with only punctuation',
        county: '!!!',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['Head of Household County:']),
        expectedDescriptions: new Map<string, string>([
            ['Head of Household County:', 'Invalid: County contains only punctuation.']
        ]),
        expectedFlags: { invalid: true },
        expectedFBMGuestCounty: '!!!'
    }
])('isValidCounty - $name', ({ county, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestCounty }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidCounty(county, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.county).toBe(expectedFBMGuestCounty);
    });
});

describe.each([
    {
        name: 'valid household size',
        householdSize: '10',
        client: mockClientComplete,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, tenPlus: false },
        expectedFBMGuestHouseholdTotal: 11
    },
    {
        name: 'null household size',
        householdSize: null,
        client: mockClientComplete,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['household_total']),
        expectedDescriptions: new Map<string, string>([
            ['household_total', 'Invalid: Missing or empty household size.']
        ]),
        expectedFlags: { invalid: true, tenPlus: false },
        expectedFBMGuestHouseholdTotal: -1
    },
    {
        name: 'negative household size',
        householdSize: '-1',
        client: mockClientComplete,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['household_total']),
        expectedDescriptions: new Map<string, string>([
            ['household_total', 'Invalid: Household size must be 10 or fewer members.']
        ]),
        expectedFlags: { invalid: true, tenPlus: false },
        expectedFBMGuestHouseholdTotal: -1
    },
    {
        name: 'household size greater than 10',
        householdSize: '11',
        client: mockClientComplete,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['household_total']),
        expectedDescriptions: new Map<string, string>([
            ['household_total', 'Invalid: Household size must be 10 or fewer members.']
        ]),
        expectedFlags: { invalid: true, tenPlus: true },
        expectedFBMGuestHouseholdTotal: -1
    },
    {
        name: 'household size mismatch',
        householdSize: '5',
        client: mockClientMissingSomeRequiredNull,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['household_total']),
        expectedDescriptions: new Map<string, string>([
            ['household_total', 'Invalid: Household does not match the number of members inputted, something seriously wrong.']
        ]),
        expectedFlags: { invalid: true, tenPlus: false },
        expectedFBMGuestHouseholdTotal: -1
    }
])('isValidHouseholdSize - $name', ({ householdSize, client, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestHouseholdTotal }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidHouseholdSize(householdSize, inputErroneousFields, client);
        expect(erroneousFields.fields_erroneous_n_description).toEqual(expectedDescriptions);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.flags.tenPlus).toBe(expectedFlags.tenPlus);
        expect(erroneousFields.FBMGuest.household_total).toBe(expectedFBMGuestHouseholdTotal);
    });
});
describe.each([
    {
        name: 'client with no household members',
        client: createClient({}),
        expectedTrueHouseholdSize: 0
    },
    {
        name: 'client with one household member',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe'
        }),
        expectedTrueHouseholdSize: 1
    },
    {
        name: 'client with multiple household members',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe',
            "2nd Member's First Name": 'Jane',
            "2nd Member's Last Name": 'Smith',
            "3rd Member's First Name": 'Alice',
            "3rd Member's Last Name": 'Johnson'
        }),
        expectedTrueHouseholdSize: 3
    },
    {
        name: 'client with non-household member keys',
        client: createClient({
            "Timestamp": '2024-06-01T12:00:00Z',
            "Head of Household First Name": 'John',
            "1st Member's First Name": 'Jane',
            "1st Member's Last Name": 'Smith'
        }),
        expectedTrueHouseholdSize: 1
    },
    {
        name: 'client with household members and unrelated keys',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe',
            "2nd Member's First Name": 'Jane',
            "2nd Member's Last Name": 'Smith',
            "Unrelated Key": 'Value'
        }),
        expectedTrueHouseholdSize: 2
    },
    {
        name: 'client with household members and empty values',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe',
            "2nd Member's First Name": '',
            "2nd Member's Last Name": 'Smith'
        }),
        expectedTrueHouseholdSize: 2
    },
    {
        name: 'client with household members and null values',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe',
            "2nd Member's First Name": null,
            "2nd Member's Last Name": 'Smith'
        }),
        expectedTrueHouseholdSize: 2
    },
    {
        name: 'client with household members and whitespace values',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe',
            "2nd Member's First Name": '   ',
            "2nd Member's Last Name": 'Smith'
        }),
        expectedTrueHouseholdSize: 2
    },
    {
        name: 'client with household members and mixed valid/invalid values',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe',
            "2nd Member's First Name": 'Jane',
            "2nd Member's Last Name": '',
            "3rd Member's First Name": null,
            "3rd Member's Last Name": 'Smith'
        }),
        expectedTrueHouseholdSize: 3
    }
    , {
        name: 'client with four members',
        client: createClient({
            "1st Member's First Name": 'John',
            "1st Member's Last Name": 'Doe',
            "2nd Member's First Name": 'Jane',
            "2nd Member's Last Name": '',
            "3rd Member's First Name": null,
            "3rd Member's Last Name": 'Smith',
            "4th Member's First Name": 'Alice',
            "4th Member's Last Name": 'Johnson'
        }),
        expectedTrueHouseholdSize: 4
    }

])('_checkTrueHouseholdSize - $name', ({ client, expectedTrueHouseholdSize }) => {
    it('returns the correct true household size', () => {
        const trueHouseholdSize = _checkTrueHouseholdSize(client);
        expect(trueHouseholdSize).toBe(expectedTrueHouseholdSize);
    });
});
describe.each([
    {
        name: 'valid single preference',
        meatPreference: 'No Beef',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false },
        expectedFBMGuestPreferences: ['No Beef']
    },
    {
        name: 'valid multiple preferences',
        meatPreference: 'No Beef, Vegetarian, Only Halal',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false },
        expectedFBMGuestPreferences: ['No Beef', 'Vegetarian', 'Only Halal', 'No Pork']
    },
    {
        name: 'invalid preference',
        meatPreference: 'No Beef, Invalid Preference',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['meatPreference']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:meatPreference', 'Invalid: Meat preference contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'empty preference',
        meatPreference: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'null preference',
        meatPreference: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'whitespace preference',
        meatPreference: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'duplicate preferences',
        meatPreference: 'No Beef, No Beef, Vegetarian',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false },
        expectedFBMGuestPreferences: ['No Beef', 'Vegetarian', 'No Pork']
    },
    {
        name: 'Vegan preference adds related preferences',
        meatPreference: 'Vegan',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false },
        expectedFBMGuestPreferences: ['Vegan', 'Vegetarian', 'No Fish/Seafood', 'No Beef', 'No Pork']
    },
    {
        name: 'Vegetarian preference adds related preferences',
        meatPreference: 'Vegetarian',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false },
        expectedFBMGuestPreferences: ['Vegetarian', 'No Beef', 'No Pork']
    }
])('isValidMeatPreference - $name', ({ meatPreference, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestPreferences }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidMeatPreference(meatPreference, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestPreferences);
    });
});
describe.each([
    {
        name: 'valid ethnic food preference',
        ethnicFoodPreference: 'Italian',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestPreferences: ['Italian']
    },
    {
        name: 'null ethnic food preference',
        ethnicFoodPreference: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'empty ethnic food preference',
        ethnicFoodPreference: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'whitespace ethnic food preference',
        ethnicFoodPreference: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'ethnic food preference with "No Preference"',
        ethnicFoodPreference: 'No Preference',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestPreferences: []
    },
    {
        name: 'valid ethnic food preference with leading/trailing whitespace',
        ethnicFoodPreference: '   Mexican   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestPreferences: ['Mexican']
    },
    {
        name: 'multiple valid ethnic food preferences added sequentially',
        ethnicFoodPreference: 'Chinese',
        inputErroneousFields: {
            ...emptyErroneous(),
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
                cf_guests_459373e1d1: ['Italian']
            } as FBMGuest
        },
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestPreferences: ['Italian', 'Chinese']
    }
])('isValidEthnicFoodPreference - $name', ({ ethnicFoodPreference, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestPreferences }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidEthnicFoodPreference(ethnicFoodPreference, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestPreferences);
    });
});
describe.each([
    {
        name: 'valid single food modification',
        foodModification: 'No Deserts',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: ['No Deserts']
    },
    {
        name: 'valid multiple food modifications',
        foodModification: 'No Deserts, Add Gluten Free, Add Sugar Free',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: ['No Deserts', 'Add Gluten Free', 'Add Sugar Free']
    },
    {
        name: 'invalid food modification',
        foodModification: 'No Deserts, Invalid Modification',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['foodModification']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_1fb4745f10:foodModification', 'Invalid: Food modification contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: []
    },
    {
        name: 'empty food modification',
        foodModification: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: []
    },
    {
        name: 'null food modification',
        foodModification: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: []
    },
    {
        name: 'whitespace food modification',
        foodModification: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: []
    },
    {
        name: 'duplicate food modifications',
        foodModification: 'No Deserts, No Deserts, Add Gluten Free',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: ['No Deserts', 'Add Gluten Free']
    },
    {
        name: 'mixed valid and invalid food modifications',
        foodModification: 'No Deserts, Add Gluten Free, Invalid Modification',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['foodModification']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_1fb4745f10:foodModification', 'Invalid: Food modification contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestModifications: []
    }
])('isValidFoodModification - $name', ({ foodModification, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestModifications }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidFoodModification(foodModification, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestModifications);
    });
});
describe.each([
    {
        name: 'valid single allergy',
        allergies: 'No Peanuts',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: ['No Peanuts']
    },
    {
        name: 'valid multiple allergies',
        allergies: 'No Peanuts, No Dairy, No Gluten',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: ['No Peanuts', 'No Dairy', 'No Gluten']
    },
    {
        name: '2 invalid allergy',
        allergies: 'No Peanuts, Invalid Allergy, pizza',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['allergies']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:allergies', 'Invalid: Allergy contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: []
    },
    {
        name: 'empty allergies',
        allergies: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: []
    },
    {
        name: 'null allergies',
        allergies: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: []
    },
    {
        name: 'whitespace allergies',
        allergies: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: []
    },
    {
        name: 'duplicate allergies',
        allergies: 'No Peanuts, No Peanuts, No Dairy',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: ['No Peanuts', 'No Dairy']
    },
    {
        name: 'custom allergy',
        allergies: 'No Peanuts, Custom Allergy',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: ['No Peanuts', 'Custom Allergy: Custom Allergy']
    },
    {
        name: 'multiple invalid allergies',
        allergies: 'Invalid Allergy 1, Invalid Allergy 2, Invalid Allergy 3',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['allergies']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:allergies', 'Invalid: Allergy contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestAllergies: []
    }
])('isValidAllergies - $name', ({ allergies, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestAllergies }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidAllergies(allergies, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid).sort()).toEqual(Array.from(expectedInvalid).sort());
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1!.sort()).toEqual(expectedFBMGuestAllergies.sort());
    });
});
describe.each([
    {
        name: 'valid life threatening allergy (Yes)',
        lifeThreateningAllergy: 'Yes',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { severeAllergy: true, invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false }
    },
    {
        name: 'valid life threatening allergy (No)',
        lifeThreateningAllergy: 'No',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { severeAllergy: false, invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false }
    },
    {
        name: 'invalid life threatening allergy (not Yes or No)',
        lifeThreateningAllergy: 'Maybe',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['lifeThreateningAllergy']),
        expectedDescriptions: new Map<string, string>([
            ['lifeThreateningAllergy', 'Invalid: Life threatening allergy must be "Yes" or "No". Something seriously wrong.']
        ]),
        expectedFlags: { severeAllergy: false, invalid: true, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false }
    },
    {
        name: 'null life threatening allergy',
        lifeThreateningAllergy: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { severeAllergy: false, invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false }
    },
    {
        name: 'empty life threatening allergy',
        lifeThreateningAllergy: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { severeAllergy: false, invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false }
    },
    {
        name: 'whitespace life threatening allergy',
        lifeThreateningAllergy: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, severeAllergy: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false }
    }
])('isValidLifeThreateningAllergy - $name', ({ lifeThreateningAllergy, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidLifeThreateningAllergy(lifeThreateningAllergy, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.severeAllergy).toBe(expectedFlags.severeAllergy);
        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
    });
});

describe.each([
    {
        name: 'valid dietary information',
        dietaryInformation: 'Gluten Free',
        inputErroneousFields: emptyErroneous(),
        expectedFBMGuestNotes: ['Notes Provided by Guest: Gluten Free']
    },
    {
        name: 'null dietary information',
        dietaryInformation: null,
        inputErroneousFields: emptyErroneous(),
        expectedFBMGuestNotes: []
    },
    {
        name: 'empty dietary information',
        dietaryInformation: '',
        inputErroneousFields: emptyErroneous(),
        expectedFBMGuestNotes: []
    },
    {
        name: 'whitespace dietary information',
        dietaryInformation: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedFBMGuestNotes: []
    },
    {
        name: 'valid dietary information with leading/trailing whitespace',
        dietaryInformation: '   Vegan   ',
        inputErroneousFields: emptyErroneous(),
        expectedFBMGuestNotes: ['Notes Provided by Guest: Vegan']
    },
    {
        name: 'multiple dietary information added sequentially',
        dietaryInformation: 'Vegetarian',
        inputErroneousFields: {
            ...emptyErroneous(),
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
                cf_guests_459373e1d1: ['Notes Provided by Guest: Gluten Free']
            }
        } as Erroneous,

        expectedFBMGuestNotes: ['Notes Provided by Guest: Gluten Free', 'Notes Provided by Guest: Vegetarian']
    }
])('isValidDietaryInformation - $name', ({ dietaryInformation, inputErroneousFields, expectedFBMGuestNotes }) => {
    it('produces correct FBMGuest notes', () => {
        const erroneousFields = isValidDietaryInformation(dietaryInformation, inputErroneousFields);

        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestNotes);
    });
});
describe.each([
    {
        name: 'valid baby services (Yes)',
        babyServices: 'Yes',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyServices: '1'
    },
    {
        name: 'valid baby services (No)',
        babyServices: 'No',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyServices: '0'
    },
    {
        name: 'invalid baby services (not Yes or No)',
        babyServices: 'Maybe',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['babyServices']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_e8827ca4cf:babyServices', 'Invalid: Baby services must be "Yes" or "No". Something seriously wrong.']
        ]),
        expectedFlags: { invalid: true, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyServices: '0'
    },
    {
        name: 'null baby services',
        babyServices: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyServices: '0'
    },
    {
        name: 'empty baby services',
        babyServices: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyServices: '0'
    },
    {
        name: 'whitespace baby services',
        babyServices: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyServices: '0'
    }
])('isValidBabyServices - $name', ({ babyServices, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestBabyServices }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidBabyServices(babyServices, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
        expect(erroneousFields.FBMGuest.cf_guests_e8827ca4cf).toBe(expectedFBMGuestBabyServices);
    });
});
describe.each([
    {
        name: 'valid single diaper size',
        diaperSize: 'New Born',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: ['Diaper Size: new born']
    },
    {
        name: 'valid multiple diaper sizes',
        diaperSize: 'New Born, 1, Pull-Ups',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: ['Diaper Size: new born', 'Diaper Size: 1', 'pull-ups']
    },
    {
        name: 'invalid diaper size',
        diaperSize: 'New Born, Invalid Size',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['diaperSize']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:diaperSize', 'Invalid: Diaper size contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: []
    },
    {
        name: 'empty diaper size',
        diaperSize: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: []
    },
    {
        name: 'null diaper size',
        diaperSize: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: []
    },
    {
        name: 'whitespace diaper size',
        diaperSize: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: []
    },
    {
        name: 'duplicate diaper sizes',
        diaperSize: 'New Born, New Born, Pull-Ups',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: ['Diaper Size: new born', 'pull-ups']
    },
    {
        name: 'mixed valid and invalid diaper sizes',
        diaperSize: 'New Born, 1, Invalid Size',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['diaperSize']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:diaperSize', 'Invalid: Diaper size contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDiaperSizes: []
    }
])('isValidDiaperSize - $name', ({ diaperSize, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestDiaperSizes }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidDiaperSize(diaperSize, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestDiaperSizes);
    });
});
describe.each([
    {
        name: 'valid baby food (Yes)',
        babyFood: 'Yes',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFood: ['Baby Food']
    },
    {
        name: 'valid baby food (No)',
        babyFood: 'No',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFood: []
    },
    {
        name: 'invalid baby food (not Yes or No)',
        babyFood: 'Maybe',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['babyFood']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:babyFood', 'Invalid: Baby food contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: true, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFood: []
    },
    {
        name: 'null baby food',
        babyFood: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFood: []
    },
    {
        name: 'empty baby food',
        babyFood: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFood: []
    },
    {
        name: 'whitespace baby food',
        babyFood: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFood: []
    }
])('isValidBabyFood - $name', ({ babyFood, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestBabyFood }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidBabyFood(babyFood, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestBabyFood);
    });
});
describe.each([
    {
        name: 'valid baby formula (Yes)',
        babyFormula: 'Yes',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFormula: ['Baby Formula']
    },
    {
        name: 'valid baby formula (No)',
        babyFormula: 'No',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFormula: []
    },
    {
        name: 'invalid baby formula (not Yes or No)',
        babyFormula: 'Maybe',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['babyFormula']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:babyFormula', 'Invalid: Baby formula contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: true, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFormula: []
    },
    {
        name: 'null baby formula',
        babyFormula: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFormula: []
    },
    {
        name: 'empty baby formula',
        babyFormula: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFormula: []
    },
    {
        name: 'whitespace baby formula',
        babyFormula: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestBabyFormula: []
    }
])('isValidBabyFormula - $name', ({ babyFormula, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestBabyFormula }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidBabyFormula(babyFormula, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestBabyFormula);
    });
});
describe.each([
    {
        name: 'valid dog food (Yes)',
        dogFood: 'Yes',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDogFood: ['Dog Food: Yes']
    },
    {
        name: 'valid dog food (No)',
        dogFood: 'No',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDogFood: []
    },
    {
        name: 'invalid dog food (not Yes or No)',
        dogFood: 'Maybe',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['dogFood']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:dogFood', 'Invalid: Dog food contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: true, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDogFood: []
    },
    {
        name: 'null dog food',
        dogFood: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDogFood: []
    },
    {
        name: 'empty dog food',
        dogFood: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDogFood: []
    },
    {
        name: 'whitespace dog food',
        dogFood: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestDogFood: []
    }
])('isValidDogFood - $name', ({ dogFood, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestDogFood }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidDogFood(dogFood, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestDogFood);
    });
});

describe.each([
    {
        name: 'valid cat food (Yes)',
        catFood: 'Yes',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestCatFood: ['Cat Food: Yes']
    },
    {
        name: 'valid cat food (No)',
        catFood: 'No',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestCatFood: []
    },
    {
        name: 'invalid cat food (not Yes or No)',
        catFood: 'Maybe',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['catFood']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:catFood', 'Invalid: Cat food contains invalid/unsupported options.']
        ]),
        expectedFlags: { erroneous: true, invalid: true, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestCatFood: []
    },
    {
        name: 'null cat food',
        catFood: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestCatFood: []
    },
    {
        name: 'empty cat food',
        catFood: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestCatFood: []
    },
    {
        name: 'whitespace cat food',
        catFood: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { erroneous: false, invalid: false, tenPlus: false, timestamp_missing: false, duplicate: false },
        expectedFBMGuestCatFood: []
    }
])('isValidCatFood - $name', ({ catFood, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags, expectedFBMGuestCatFood }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidCatFood(catFood, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.erroneous).toBe(expectedFlags.erroneous);
        expect(erroneousFields.FBMGuest.cf_guests_459373e1d1).toEqual(expectedFBMGuestCatFood);
    });
});

describe.each([
    {
        name: 'valid acknowledgment (Yes)',
        acknowledgment: 'Yes',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
    },
    {
        name: 'invalid acknowledgment (not Yes)',
        acknowledgment: 'No',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(['acknowledgment']),
        expectedDescriptions: new Map<string, string>([
            ['cf_guests_459373e1d1:acknowledgment', 'Invalid: Acknowledgment must be "Yes". Something seriously wrong.']
        ]),
        expectedFlags: { invalid: true, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
    },
    {
        name: 'null acknowledgment',
        acknowledgment: null,
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
    },
    {
        name: 'empty acknowledgment',
        acknowledgment: '',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
    },
    {
        name: 'whitespace acknowledgment',
        acknowledgment: '   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
    },
    {
        name: 'valid acknowledgment with leading/trailing whitespace',
        acknowledgment: '   Yes   ',
        inputErroneousFields: emptyErroneous(),
        expectedInvalid: new Set<string>(),
        expectedDescriptions: new Map<string, string>(),
        expectedFlags: { invalid: false, erroneous: false, tenPlus: false, timestamp_missing: false, duplicate: false },
    }
])('isValidAcknowledgment - $name', ({ acknowledgment, inputErroneousFields, expectedInvalid, expectedDescriptions, expectedFlags }) => {
    it('produces correct erroneous fields and flags', () => {
        const erroneousFields = isValidAcknowledgment(acknowledgment, inputErroneousFields);

        expect(Array.from(erroneousFields.fields_invalid)).toEqual(Array.from(expectedInvalid));
        expect(erroneousFields.fields_erroneous_n_description.size).toBe(expectedDescriptions.size);
        expectedInvalid.forEach((field) => {
            expect(erroneousFields.fields_erroneous_n_description.get(field)).not.toBeNull();
        });

        expect(erroneousFields.flags.invalid).toBe(expectedFlags.invalid);
    });
});
describe.each([
    {
        name: 'all fields are null',
        member: { firstName: null, age: null, lastName: null, number: 1 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: emptyErroneous(),
        expectedMember: { firstName: '', age: '', lastName: '', number: 1 },
    },
    {
        name: 'missing first name',
        member: { firstName: null, age: '25', lastName: 'Doe', number: 2 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member2FirstName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member2FirstName', 'Invalid: Missing or empty first name for a household member.']
            ])
        },
        expectedMember: { firstName: '', age: '25', lastName: 'Doe', number: 2 },
    },
    {
        name: 'missing age',
        member: { firstName: 'John', age: null, lastName: 'Doe', number: 3 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member3Age']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member3Age', 'Invalid: Missing or empty age for a household member.']
            ])
        },
        expectedMember: { firstName: 'John', age: '', lastName: 'Doe', number: 3 },
    },
    {
        name: 'missing last name',
        member: { firstName: 'John', age: '25', lastName: null, number: 4 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member4LastName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member4LastName', 'Invalid: Missing or empty last name for a household member.']
            ])
        },
        expectedMember: { firstName: 'John', age: '25', lastName: '', number: 4 },
    },
    {
        name: 'all fields are present',
        member: { firstName: 'John', age: '25', lastName: 'Doe', number: 5 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: emptyErroneous(),
        expectedMember: { firstName: 'John', age: '25', lastName: 'Doe', number: 5 },
    },
    {
        name: 'multiple missing fields',
        member: { firstName: null, age: null, lastName: 'Doe', number: 6 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member6FirstName', 'member6Age']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member6FirstName', 'Invalid: Missing or empty first name for a household member.'],
                ['othersHousehold:member6Age', 'Invalid: Missing or empty age for a household member.']
            ])
        },
        expectedMember: { firstName: '', age: '', lastName: 'Doe', number: 6 },
    }
])('isMemberMissingImportantField - $name', ({ member, inputErroneousFields, expectedErroneousFields, expectedMember }) => {
    it('produces correct erroneous fields and member data', () => {
        const { erroneous, member: updatedMember } = isMemberMissingImportantField(member, inputErroneousFields);

        expect(erroneous).toEqual(expectedErroneousFields);
        expect(updatedMember).toEqual(expectedMember);
    });
});
describe.each([
    {
        name: 'valid first name',
        member: { firstName: 'John', age: '25', lastName: 'Doe', number: 1 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: emptyErroneous(),
    },
    {
        name: 'first name contains digits',
        member: { firstName: 'John123', age: '25', lastName: 'Doe', number: 2 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { erroneous: true, invalid: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member2FirstName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member2FirstName', 'First name contains digits.']
            ])
        },
    },
    {
        name: 'empty first name',
        member: { firstName: '', age: '25', lastName: 'Doe', number: 3 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member3FirstName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member3FirstName', 'Invalid: Missing or empty first name for a household member.']
            ])
        },
    },
    {
        name: 'whitespace first name',
        member: { firstName: '   ', age: '25', lastName: 'Doe', number: 4 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member4FirstName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member4FirstName', 'Invalid: Missing or empty first name for a household member.']
            ])
        },
    },
])('isValidMemberFirstName - $name', ({ member, inputErroneousFields, expectedErroneousFields }) => {

    it('produces correct erroneous fields', () => {
        const erroneousFields = isValidMemberFirstName(member, inputErroneousFields);
        expect(erroneousFields).toEqual(expectedErroneousFields);
    });
});

describe.each([
    {
        name: 'valid last name',
        member: { firstName: 'John', age: '25', lastName: 'Doe', number: 1 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: emptyErroneous(),
    },
    {
        name: 'last name contains digits',
        member: { firstName: 'John', age: '25', lastName: 'Doe123', number: 2 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { erroneous: true, invalid: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member2LastName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member2LastName', 'Last name contains digits.']
            ])
        },
    },
    {
        name: 'empty last name',
        member: { firstName: 'John', age: '25', lastName: '', number: 3 },
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member3LastName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member3LastName', 'Invalid: Missing or empty last name for a household member.']
            ])
        },
        inputErroneousFields: emptyErroneous(),
    },
    {
        name: 'whitespace last name',
        member: { firstName: 'John', age: '25', lastName: '   ', number: 4 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member4LastName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member4LastName', 'Invalid: Missing or empty last name for a household member.']
            ])
        }
    },
])('isValidMemberLastName - $name', ({ member, inputErroneousFields, expectedErroneousFields }) => {

    it('produces correct erroneous fields', () => {
        const erroneousFields = isValidMemberLastName(member, inputErroneousFields);
        expect(erroneousFields).toEqual(expectedErroneousFields);
    });
});

describe.each([
    {
        name: 'valid age',
        member: { firstName: 'John', age: '25', lastName: 'Doe', number: 1 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: emptyErroneous(),
    },
    {
        name: 'age contains non-digit characters',
        member: { firstName: 'John', age: '25a', lastName: 'Doe', number: 2 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member2Age']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member2Age', 'Age must be a valid integer.']
            ])
        },
    },
    {
        name: 'negative age',
        member: { firstName: 'John', age: '-5', lastName: 'Doe', number: 3 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false, hohInMembers: false },
            fields_invalid: new Set(['member3Age']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member3Age', 'Age must be a valid integer.']
            ])
        },
    },
    {
        name: 'empty age',
        member: { firstName: 'John', age: '', lastName: 'Doe', number: 4 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member4Age']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member4Age', 'Invalid: Missing or empty age for a household member.']
            ])
        },
    },
    {
        name: 'whitespace age',
        member: { firstName: 'John', age: '   ', lastName: 'Doe', number: 5 },
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { invalid: true, erroneous: false, hohInMembers: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, duplicate: false },
            fields_invalid: new Set(['member5Age']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member5Age', 'Invalid: Missing or empty age for a household member.']
            ])
        },
    },
])('isValidMemberAge - $name', ({ member, inputErroneousFields, expectedErroneousFields }) => {

    it('produces correct erroneous fields', () => {
        const erroneousFields = isValidMemberAge(member, inputErroneousFields);
        expect(erroneousFields).toEqual(expectedErroneousFields);
    });
});

describe.each([
    {
        name: 'member is head of household',
        member: { firstName: 'John', age: '25', lastName: 'Doe', number: 1 },
        inputErroneousFields: emptyErroneous(),
        headofhouseholdFirstName: 'John',
        headofhouseholdAge: '25',
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: { duplicate: true, hohInMembers: true, erroneous: false, severeAllergy: false, tenPlus: false, timestamp_missing: false, invalid: false },
            fields_invalid: new Set(['member1']),
            fields_erroneous_n_description: new Map([
                ['member1', 'Invalid: Household member is the head of household, should not be included in the list of members.']
            ])
        },
    },
    {
        name: 'member is not head of household',
        member: { firstName: 'Jane', age: '30', lastName: 'Smith', number: 2 },
        inputErroneousFields: emptyErroneous(),
        headofhouseholdFirstName: 'John',
        headofhouseholdAge: '25',
        expectedErroneousFields: emptyErroneous(),
    },
])('isHeadOfHouseholdMember - $name', ({ member, inputErroneousFields, headofhouseholdFirstName, headofhouseholdAge, expectedErroneousFields }) => {
    it('produces correct erroneous fields', () => {
        const erroneousFields = isHeadOfHouseholdMember(member, inputErroneousFields, headofhouseholdFirstName, headofhouseholdAge);
        expect(erroneousFields).toEqual(expectedErroneousFields);
    });
});

describe.each([
    {
        name: 'valid household members',
        client: new Map([
            ['Head of Household First Name', 'John'],
            ['Head of Household Last Name', 'Doe'],
            ['Head of Household Age', '40'],
            ['1st member\'s first name', 'Jane'],
            ['1st member\'s last name', 'Doe'],
            ['1st member\'s age', '25'],
            ['2nd member\'s first name', 'Alice'],
            ['2nd member\'s last name', 'Doe'],
            ['2nd member\'s age', '18']
        ]),
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: {
                invalid: false, erroneous: false,
                hohInMembers: false,
                severeAllergy: false,
                tenPlus: false,
                timestamp_missing: false,
                duplicate: false
            },
            fields_invalid: new Set([]),
            fields_erroneous_n_description: new Map([
            ])
        }
    },
    {
        name: 'missing first name for a household member',
        client: new Map([
            ['Head of Household First Name', 'John'],
            ['Head of Household Last Name', 'Doe'],
            ['Head of Household Age', '40'],
            ['1st member\'s first name', null],
            ['1st member\'s last name', 'Doe'],
            ['1st member\'s age', '25']
        ]),
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: {
                invalid: true, erroneous: false,
                hohInMembers: false,
                severeAllergy: false,
                tenPlus: false,
                timestamp_missing: false,
                duplicate: false
            },
            fields_invalid: new Set(['member1FirstName']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member1FirstName', 'Invalid: Missing or empty first name for a household member.']
            ])
        }
    },
    {
        name: 'missing age for a household member',
        client: new Map([
            ['Head of Household First Name', 'John'],
            ['Head of Household Last Name', 'Doe'],
            ['Head of Household Age', '40'],
            ['1st member\'s first name', 'Jane'],
            ['1st member\'s last name', 'Doe'],
            ['1st member\'s age', null]
        ]),
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: {
                invalid: true, erroneous: false,
                hohInMembers: false,
                severeAllergy: false,
                tenPlus: false,
                timestamp_missing: false,
                duplicate: false
            },
            fields_invalid: new Set(['member1Age']),
            fields_erroneous_n_description: new Map([
                ['othersHousehold:member1Age', 'Invalid: Missing or empty age for a household member.']
            ])
        }
    },
    {
        name: 'empty household member fields',
        client: new Map([
            ['Head of Household First Name', 'John'],
            ['Head of Household Last Name', 'Doe'],
            ['Head of Household Age', '40'],
            ['1st member\'s first name', null],
            ['1st member\'s last name', null],
            ['1st member\'s age', null]
        ]),
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: emptyErroneous()
    },
    {
        name: 'household member is head of household',
        client: new Map([
            ['Head of Household First Name', 'John'],
            ['Head of Household Last Name', 'Doe'],
            ['Head of Household Age', '40'],
            ['1st member\'s first name', 'John'],
            ['1st member\'s last name', 'Doe'],
            ['1st member\'s age', '40']
        ]),
        inputErroneousFields: emptyErroneous(),
        expectedErroneousFields: {
            ...emptyErroneous(),
            flags: {
                invalid: false,
                erroneous: false,
                hohInMembers: true,
                severeAllergy: false,
                tenPlus: false,
                timestamp_missing: false,
                duplicate: true
            },
            fields_invalid: new Set(['member1']),
            fields_erroneous_n_description: new Map([
                ['member1', 'Invalid: Household member is the head of household, should not be included in the list of members.']
            ])
        }
    }
])('isValidHouseholdMembers - $name', ({ client, inputErroneousFields, expectedErroneousFields }) => {
    it('produces correct erroneous fields', () => {
        const erroneousFields = isValidHouseholdMembers(client, inputErroneousFields);
        expect(erroneousFields).toEqual(expectedErroneousFields);
    });
});

