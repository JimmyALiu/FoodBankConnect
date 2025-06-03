import { Clients, Client, requiredFields, Erroneous, emptyFBMGuest, copyErroneous, emptyErroneous, fieldMap } from './custom_types'; // Assume you have a Client type defined somewhere
import { FBMGuest } from '../../routes/helper';
//import { saveFlagRecord } from './flagRecordService'; // Assume this saves flag records to your server
//import { sendToFBM } from './fbmService'; // Assume this sends clients to FBM


/**simply check to see if required fields are there
 * flags if the client is invalid, or if the timestamp is missing
 * @param {Client} client - The client to be checked.
 * @returns {Erroneous} - a copy of the passed Erroneous object with the fields_invalid and fields_erroneous_n_description set.
 */
export function _allRequiredFieldsThere(client: Client, inputErroneousFields: Erroneous): Erroneous {
    // const requiredFields = [
    //     'Timestamp',
    //     'Head of Household County:',
    //     'Head of Household First Name',
    //     'Head of Household Last Name',
    //     'Head of Household Date of Birth',
    //     'Head of Household City:',
    //     'Head of Household Zip code:',
    //     'Other than the Head of Household, how many people in their/your household?'
    // ];
    const erroneousFields = copyErroneous(inputErroneousFields);
    for (const field of requiredFields) {
        if (!client.has(field) || client.get(field) === null || client.get(field) === '') {
            erroneousFields.flags['invalid'] = true;
            const fbmfield: string = _requiredFieldsToFBMString(field);
            erroneousFields.fields_invalid.add(fbmfield);

            erroneousFields.fields_erroneous_n_description.set(fbmfield, `Invalid: Missing required field: ${field}`);

            if (field === 'Timestamp') {
                erroneousFields.flags['timestamp_missing'] = true; // FBM requires a timestamp, so we set it to '\0' if missing
            } else {
                //FBM already set to empty string
            }
        } else {
            //field found
        }
    }
    //erroneousFields.fields_invalid = _requiredFieldsToFBM(erroneousFields.fields_invalid);
    return erroneousFields;
}

/**does all preliminary checks, all invalid flags happen in this code block
 * some erroneous ones are checked for the custom fields
 * builds some of the generated information when convenient
 * flags if the timestamp is missing
 * @param {Client} client - The client to be checked.
 * @returns {Erroneous} - a copy of the passed Erroneous object with the fields_invalid and fields_erroneous_n_description set.
 */
export function _invalidChecker(client: Client, inputErroneousFields: Erroneous): Erroneous {

    let erroneousFields: Erroneous = copyErroneous(inputErroneousFields);
    erroneousFields = isValidTimestamp(client.get("Timestamp"), erroneousFields);
    erroneousFields = isValidFirstName(client.get("Head of Household First Name"), erroneousFields);
    erroneousFields = isValidLastName(client.get("Head of Household Last Name"), erroneousFields);
    erroneousFields = isValidDateOfBirth(client.get("Head of Household Date of Birth"), erroneousFields);

    const { erroneousFields: houseNumberErroneousFields, houseNumber } = isValidHouseNumber(client.get("Head of Household House Number:"), erroneousFields);
    erroneousFields = houseNumberErroneousFields;


    const { erroneousFields: streetErroneousFields, street } = isValidStreet(client.get("Head of Household Street:"), erroneousFields);
    erroneousFields = streetErroneousFields;
    erroneousFields.FBMGuest.street_address = `${houseNumber} ${street}`.trim(); // Combine house number and street for FBM


    erroneousFields = isValidApartment(client.get("Head of Household APT # (if Applicable):"), erroneousFields);
    erroneousFields = isValidCity(client.get("Head of Household City:"), erroneousFields);
    erroneousFields = isValidZipCode(client.get("Head of Household Zip code:"), erroneousFields);
    erroneousFields = isValidCounty(client.get("Head of Household County:"), erroneousFields);
    erroneousFields.FBMGuest.state = 'WA'; // just hardcode to be in washington
    erroneousFields = isValidHouseholdSize(client.get("Other than the Head of Household, how many people in their/your household?"), erroneousFields, client);
    erroneousFields = isValidMeatPreference(client.get("In terms of meat, does your family eat..."), erroneousFields);
    erroneousFields = isValidEthnicFoodPreference(client.get("Does your family have a preference for any of the following types of cultural or ethnic foods? "), erroneousFields);
    erroneousFields = isValidFoodModification(client.get("Pick up food modification:"), erroneousFields);
    erroneousFields = isValidAllergies(client.get("Allergies: please denote foods that should not appear in your ready to pick up bags"), erroneousFields);
    erroneousFields = isValidLifeThreateningAllergy(client.get("I have a life threatening Allergy and need individualized assistance to avoid cross contamination. (will follow up in person)"), erroneousFields);
    erroneousFields = isValidDietaryInformation(client.get("Any other dietary/ food choice information you would like us to add to your file (add notes about allergens not listed here)"), erroneousFields);
    erroneousFields = isValidBabyServices(client.get("Do you have a baby and want extra services?"), erroneousFields);
    erroneousFields = isValidAdultDiapers(client.get("Do you need adult diapers?"), erroneousFields);
    erroneousFields = isValidDiaperSize(client.get("What size diapers does your baby(s) need?"), erroneousFields);
    erroneousFields = isValidBabyFood(client.get("Do You Need Baby Food?"), erroneousFields);
    erroneousFields = isValidBabyFormula(client.get("Do You Need Baby Formula?"), erroneousFields);
    erroneousFields = isValidFormulaType(client.get("If yes, what type?"), erroneousFields);
    erroneousFields = isValidDogFood(client.get("Do you need dog food?"), erroneousFields);
    erroneousFields = isValidCatFood(client.get("Do you need cat food?"), erroneousFields);
    erroneousFields = isValidAcknowledgment(client.get("I acknowledge"), erroneousFields);
    erroneousFields = isValidHouseholdMembers(client, erroneousFields);


    return erroneousFields;
}

/**
 * Checks if the timestamp is valid.
 * A timestamp is invalid if it is null, empty, whitespace, not a valid date, or is in the future.
 * @param timestamp - The timestamp to be checked, expected in the format 'MM/DD/YYYY HH:mm:ss'.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidTimestamp(timestamp: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (!timestamp || timestamp.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('Timestamp');
        erroneousFields.fields_erroneous_n_description.set('Timestamp', 'Invalid: Missing or empty timestamp.');
    } else {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('Timestamp');
            erroneousFields.fields_erroneous_n_description.set('Timestamp', 'Invalid: Timestamp is not a valid date.');
        } else if (date > new Date()) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('Timestamp');
            erroneousFields.fields_erroneous_n_description.set('Timestamp', 'Invalid: Timestamp is in the future.');
        }
    }
    //dont add timestamp to fbm

    return erroneousFields;
}

/**
 * Checks if the first name is valid.
 * A first name is invalid if it is null, empty, or contains only whitespace. Or only contains punctuation.
 * adds first name to FBMGuest.firstname
 * @param firstName - The first name to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidFirstName(firstName: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (!firstName || firstName.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('firstname');
        erroneousFields.fields_erroneous_n_description.set('firstname', 'Invalid: Missing or empty first name.');
    } else if (/^[\W_]+$/.test(firstName)) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('firstname');
        erroneousFields.fields_erroneous_n_description.set('firstname', 'Invalid: First name contains only punctuation.');
    }
    if (firstName) {
        erroneousFields.FBMGuest.firstname = firstName.trim(); // Clean up the first name for FBM
    } else {
        erroneousFields.FBMGuest.firstname = '';
    }

    return erroneousFields;
}

/**
 * Checks if the last name is valid.
 * A last name is invalid if it is null, empty, or contains only whitespace. Or only contains punctuation.
 * adds last name to FBMGuest.lastname
 * @param lastName - The last name to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidLastName(lastName: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (!lastName || lastName.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('lastname');
        erroneousFields.fields_erroneous_n_description.set('lastname', 'Invalid: Missing or empty last name.');
    } else if (/^[\W_]+$/.test(lastName)) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('lastname');
        erroneousFields.fields_erroneous_n_description.set('lastname', 'Invalid: Last name contains only punctuation.');
    }
    if (lastName) {
        erroneousFields.FBMGuest.lastname = lastName.trim(); // Clean up the last name for FBM
    } else {
        erroneousFields.FBMGuest.lastname = '';
    }

    return erroneousFields;
}

/**
 * Checks if the date of birth is valid.
 * A date of birth is invalid if it is null, empty, whitespace, not a valid date, over 150 years old or in the future.
 * adds date of birth to FBMGuest.dob
 * @param dob - The date of birth to be checked, expected in the format 'YYYY-MM-DD HH:mm:ss' or 'YYYY-MM-DD'.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidDateOfBirth(dob: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    const initialdob = dob;
    //just in case
    if (dob && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dob)) {
        // Convert 'YYYY-MM-DD HH:mm:ss' to 'YYYY-MM-DDTHH:mm:ss'
        dob = dob.replace(' ', 'T');
    }

    //now check formatting
    if (dob && /^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        // Convert 'YYYY-MM-DD' to 'YYYY-MM-DDTHH:mm:ss'
        dob = dob + 'T00:00:00'; // Add time part to make it a valid date string
    }

    //now all formating must conform to the structure of 'YYYY-MM-DDTHH:mm:ss'

    if (!dob || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dob)) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('dob');
        erroneousFields.fields_erroneous_n_description.set('dob', 'Invalid: dob is in the wrong format.');
        if (!initialdob) {
            erroneousFields.FBMGuest.dob = ''; // Set to empty string if no initial date of birth
        } else {
            erroneousFields.FBMGuest.dob = initialdob.trim(); //set to a default invalid date
        }
        return erroneousFields; // Return early if the format is incorrect
    }

    if (dob.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('dob');
        erroneousFields.fields_erroneous_n_description.set('dob', 'Invalid: Missing or empty date of birth.');
    } else {
        const date = new Date(dob);
        const age = new Date().getFullYear() - date.getFullYear();
        if (isNaN(date.getTime())) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('dob');
            erroneousFields.fields_erroneous_n_description.set('dob', 'Invalid: Date of birth is not a valid date.');
        } else if (age > 150) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('dob');
            erroneousFields.fields_erroneous_n_description.set('dob', 'Invalid: Date of birth is over 150 years old.');
        } else if (date > new Date()) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('dob');
            erroneousFields.fields_erroneous_n_description.set('dob', 'Invalid: Date of birth is in the future.');
        }
        //deposit the date of birth in the FBMGuest object
        erroneousFields.FBMGuest.dob = date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD' format
    }

    return erroneousFields;
}

/**
 * Checks if the street is valid.
 * A street is always valid
 * @param street - The street to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidStreet(street: string | null | undefined, inputErroneousFields: Erroneous): { erroneousFields: Erroneous, street: string } {
    if (street) {
        street = street.trim(); // Clean up the street for FBM
    } else {
        street = '';
    }

    return { erroneousFields: inputErroneousFields, street };
}

/**
 * Checks if the house number is valid.
 * A house number is never invalid
 * @param houseNumber - The house number to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidHouseNumber(houseNumber: string | null | undefined, inputErroneousFields: Erroneous): { erroneousFields: Erroneous, houseNumber: string } {
    if (houseNumber) {
        houseNumber = houseNumber.trim(); // Clean up the house number for FBM
    } else {
        houseNumber = '';
    }

    return { erroneousFields: inputErroneousFields, houseNumber };
}

/**
 * Checks if the apartment number is valid.
 * An apartment number is always valid
 * @param apt - The apartment number to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidApartment(apt: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (apt && apt.trim() !== '') {
        apt = apt.trim(); // Clean up the apartment number for FBM
        erroneousFields.FBMGuest.apartment = apt;
    } else {
        erroneousFields.FBMGuest.apartment = undefined; //ensure its undefined
    }

    return erroneousFields;
}

/**
 * Checks if the city is valid.
 * A city is invalid if it is null, empty, or contains only whitespace.
 * adds city to FBMGuest.city
 * @param city - The city to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidCity(city: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (!city || city.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('city');
        erroneousFields.fields_erroneous_n_description.set('city', 'Invalid: Missing or empty city.');
    } else if (/^[\W_]+$/.test(city)) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('city');
        erroneousFields.fields_erroneous_n_description.set('city', 'Invalid: City contains only punctuation.');
    }
    if (city) {
        erroneousFields.FBMGuest.city = city.trim(); // Clean up the city for FBM
    } else {
        erroneousFields.FBMGuest.city = '';
    }

    return erroneousFields;
}

/**
 * Checks if the zip code is valid.
 * A zip code is invalid if it is not 5 digits long, contains non-digit characters
 * will return a description of 9 letter codes being potentially a postal code
 * adds zip code to FBMGuest.zipcode
 * @param zip - The zip code to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidZipCode(zip: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    zip = zip ? zip.trim().replace(/[^\d]/g, '') : ''; // Clean up the zip code for FBM
    if (!zip || zip.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('zipcode');
        erroneousFields.fields_erroneous_n_description.set('zipcode', 'Invalid: Missing or empty zip code.');
    } else if (!/^\d{5}$/.test(zip)) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('zipcode');

        if (/^.{9}$/.test(zip)) {
            erroneousFields.fields_erroneous_n_description.set('zipcode', 'Potentially erroneous: 9-digit zip codes may represent postal codes.');
        } else {
            erroneousFields.fields_erroneous_n_description.set('zipcode', 'Invalid: Zip code must be 5 digits long.');
        }
    }
    if (zip) {
        erroneousFields.FBMGuest.zipcode = zip.trim().replace(/[^\d]/g, ''); // Clean up the zip code for FBM
    } else {
        erroneousFields.FBMGuest.zipcode = '';
    }

    return erroneousFields;
}

/**
 * Checks if the county is valid.
 * A county is invalid if it is null, empty, or contains only whitespace.
 * adds county to FBMGuest.county
 * @param county - The county to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidCounty(county: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (!county || county.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('Head of Household County:');
        erroneousFields.fields_erroneous_n_description.set('Head of Household County:', 'Invalid: Missing or empty county.');
    } else if (/^[\W_]+$/.test(county)) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('Head of Household County:');
        erroneousFields.fields_erroneous_n_description.set('Head of Household County:', 'Invalid: County contains only punctuation.');
    }
    if (county) {
        erroneousFields.FBMGuest.county = county.trim(); // Clean up the county for FBM
    } else {
        erroneousFields.FBMGuest.county = '';
    }

    return erroneousFields;
}

/**
 * Checks if the household size is valid.
 * A household size is invalid if it is null, empty, or not a valid integer
 * could also be invalid if the number of members is over the inputted amount
 * adds household size to FBMGuest.household_total
 * @param householdSize - The household size to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidHouseholdSize(householdSize: string | null | undefined, inputErroneousFields: Erroneous, client: Client): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (householdSize && householdSize.trim() === '10+') {
        erroneousFields.flags['tenPlus'] = true; // Flag for more than 10 members
        erroneousFields.fields_erroneous_n_description.set('household_total', 'Household size is 11+ members HOH included, needs additional help to process in person.');
        erroneousFields.FBMGuest.household_total = -1; // Set the household size to -1 to indicate 10+ members
        return erroneousFields; // If the input is '10+', we don't need to validate further
    }

    if (!householdSize || householdSize.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('household_total');
        erroneousFields.fields_erroneous_n_description.set('household_total', 'Invalid: Missing or empty household size.');
        erroneousFields.FBMGuest.household_total = -1; // Set the household size to -1 if missing
    }
    else if (isNaN(parseInt(householdSize, 10))) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('household_total');
        erroneousFields.fields_erroneous_n_description.set('household_total', 'Invalid: Household size must be a valid integer.');
        erroneousFields.FBMGuest.household_total = -1; // Set the household size to -1 if invalid
    } else {
        const household_total: number = parseInt(householdSize, 10);
        if (household_total < 0) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('household_total');
            erroneousFields.fields_erroneous_n_description.set('household_total', 'Invalid: Household size must be 10 or fewer members.');
            erroneousFields.FBMGuest.household_total = -1; // Set the household size to -1 if negative
        }
        else if (household_total > 10) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('household_total');
            erroneousFields.fields_erroneous_n_description.set('household_total', 'Invalid: Household size must be 10 or fewer members.');
            erroneousFields.flags['tenPlus'] = true; // Flag for more than 10 members
            erroneousFields.FBMGuest.household_total = -1; // Set the household size to -1 if over 10
        } else if (_checkTrueHouseholdSize(client) != household_total) {
            //console.log('Household size mismatch: %d vs %d', _checkTrueHouseholdSize(client), household_total);
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('household_total');
            erroneousFields.fields_erroneous_n_description.set('household_total', 'Invalid: Household does not match the number of members inputted, something seriously wrong.');
            erroneousFields.FBMGuest.household_total = -1; // Set the household size to -1 if over 10
        } else {
            //need to add by 1 to include household head
            erroneousFields.FBMGuest.household_total = household_total + 1; // Set the household size in FBMGuest
        }

    }

    return erroneousFields;
}

/**
 * returns the true household size based on the client
 * does not check if the number matches valid clients. assume all members are valid
 * @param householdSize - The household size to be checked.
 * @param client - The client to be checked.
 */
export function _checkTrueHouseholdSize(client: Client): number {
    //look for any key in client which has 1st...10th, the key with the highest power is the true number, so if a 10 is found then 10 is the true number
    const householdMembers: number[] = Array.from(client.keys())
        .filter(key => key != null && key != undefined && client.get(key) != null && client.get(key) != undefined && client.get(key)?.trim() !== '')
        .map(key => key.match(/(\d+)(?:st|nd|rd|th) member's.*/i))
        .filter(match => match !== null)
        .map(match => parseInt(match![1], 10));
    //console.log('Household members found:', householdMembers);
    return householdMembers.length > 0 ? Math.max(...householdMembers) : 0; // Return the maximum member number found, or 0 if none found
}

/**
 * Checks if the meat preference is valid.
 * it should be a list of , separated values, null or one value
 * possible values are
 * No Beef, No Pork, No Fish/Seafood, Vegetarian, Vegan, Only Halal, Only Kosher
 * adds meat preference to FBMGuest.cf_guests_459373e1d1 as a string[]
 * @param meatPreference - The meat preference to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidMeatPreference(meatPreference: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    if (!meatPreference || meatPreference.trim() === '') {
        // Set to empty array if no preference
        return erroneousFields;
    }

    const validPreferences = new Set(['No Beef', 'No Pork', 'No Fish/Seafood', 'Vegetarian', 'Vegan', 'Only Halal', 'Only Kosher']);
    const preferences: string[] = meatPreference.split(',').map(pref => pref.trim());
    const uniquePreferences = new Set(preferences); // Remove duplicates

    // Add related preferences for Vegan
    if (uniquePreferences.has('Vegan')) {
        uniquePreferences.add('Vegetarian'); // If Vegan is selected, also add Vegetarian
        uniquePreferences.add('No Fish/Seafood'); // If Vegan is selected, also add No Fish/Seafood
    }

    // Add related preferences for Vegetarian
    if (uniquePreferences.has('Vegetarian')) {
        uniquePreferences.add('No Beef'); // If Vegetarian is selected, also add No Beef
        uniquePreferences.add('No Pork'); // If Vegetarian is selected, also add No Pork
    }

    let invalid: boolean = false;

    //if contains some invalid preference then mark as invalid
    uniquePreferences.forEach(pref => {
        if (!validPreferences.has(pref)) {
            invalid = true;
            erroneousFields.flags['erroneous'] = true;
            erroneousFields.fields_invalid.add('meatPreference');
            erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:meatPreference', 'Invalid: Meat preference contains invalid/unsupported options.');
        }
    });


    if (invalid) {
        return erroneousFields;
    } else {
        erroneousFields.FBMGuest.cf_guests_459373e1d1!.push(...Array.from(uniquePreferences));
        return erroneousFields;
    }
}

/**
 * Checks if the ethnic food preference is valid.
 * it should be one string
 * always valid, but wont add if no preference is selected
 * adds ethnic food preference to FBMGuest.cf_guests_459373e1d1
 * @param ethnicFoodPreference - The ethnic food preference to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidEthnicFoodPreference(ethnicFoodPreference: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    if (!ethnicFoodPreference || ethnicFoodPreference.trim() === '') {
        // dont do anything if no preference
        return erroneousFields;
    } else {
        if (ethnicFoodPreference.trim() === 'No Preference') {
            //do nothing
        } else {
            erroneousFields.FBMGuest.cf_guests_459373e1d1.push(ethnicFoodPreference.trim());
        }
    }

    return erroneousFields;
}

/**
 * Checks if the food modification is valid.
 * A food modification is seperated by commas, and are only ever these values:
 * No Deserts, No Canned Food, Add Gluten Free, Add Sugar Free, Add Low Sodium Foods, Add Alternative Milk
 * adds food modification to FBMGuest.cf_guests_1fb4745f10
 * @param foodModification - The food modification to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidFoodModification(foodModification: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    if (!foodModification || foodModification.trim() === '') {
        // Set to empty array if no preference
        return erroneousFields;
    }
    const validModifications = new Set(['No Deserts', 'No Canned Food', 'Add Gluten Free', 'Add Sugar Free', 'Add Low Sodium Foods', 'Add Alternative Milk']);
    const modifications: string[] = foodModification.split(',').map(mod => mod.trim());
    const uniqueModifications = new Set(modifications); // Remove duplicates
    let invalid = false;
    //for each modification, check if it is valid
    uniqueModifications.forEach(mod => {
        if (!validModifications.has(mod)) {
            invalid = true;
            erroneousFields.flags['erroneous'] = true;
            erroneousFields.fields_invalid.add('foodModification');
            erroneousFields.fields_erroneous_n_description.set('cf_guests_1fb4745f10:foodModification', 'Invalid: Food modification contains invalid/unsupported options.');
        }
    });

    if (invalid) {
        return erroneousFields;
    } else {
        erroneousFields.FBMGuest.cf_guests_459373e1d1!.push(...Array.from(uniqueModifications));
        return erroneousFields;
    }
}

/**
 * Checks if the allergies are valid.
 * A food modification is seperated by commas, and one other value:
 * No Peanuts, No Tree Nuts, No Eggs, No Dairy, No Gluten, No Soy, No Fish, No Shellfish, No Sesame, {Other}
 * adds allergies to FBMGuest.cf_guests_459373e1d1
 * @param allergies - The allergies to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidAllergies(allergies: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    if (!allergies || allergies.trim() === '') {
        // dont do anything if no allergies
        return erroneousFields;
    }
    //note we will have one other category, but it is invalid if there are 2 categories outside of this set
    const validAllergies: Set<string> = new Set(['No Peanuts', 'No Tree Nuts', 'No Eggs', 'No Dairy', 'No Gluten', 'No Soy', 'No Fish', 'No Shellfish', 'No Sesame']);
    const allergyList: string[] = allergies.split(',').map(allergy => allergy.trim());
    const uniqueAllergies: Set<string> = new Set(allergyList); // Remove duplicates
    let i: number = 0;
    //for each allergy, check if it is valid
    let hasCustomAllergy: string = '';
    uniqueAllergies.forEach(allergy => {
        if (!validAllergies.has(allergy)) {
            i++;
            //know it cant be undefined
            hasCustomAllergy = allergy; // Store the custom allergy
        }
    });



    if (i >= 2) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('allergies');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:allergies', 'Invalid: Allergy contains invalid/unsupported options.');
        //dont want to add corrupted data to FBM
        return erroneousFields;
    } else {
        if (i === 1) {
            //if there is a custom allergy, add it to the FBMGuest
            erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Custom Allergy: ' + hasCustomAllergy);
            uniqueAllergies.delete(hasCustomAllergy); // Remove the custom allergy from the unique allergies
        }
    }
    // Add the valid allergies to the FBMGuest
    erroneousFields.FBMGuest.cf_guests_459373e1d1.push(...Array.from(uniqueAllergies));


    return erroneousFields;
}


/**
 * should be yes or no, if yes then flag as true
 * if null, empty or undefined ignore
 * otherwise it is invalid
 * adds life threatening allergy to FBMGuest.cf_guests_459373e1d1
 * @param lifeThreateningAllergy - The life threatening allergy to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidLifeThreateningAllergy(lifeThreateningAllergy: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (lifeThreateningAllergy === undefined || lifeThreateningAllergy === null || lifeThreateningAllergy.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }
    if (lifeThreateningAllergy && lifeThreateningAllergy.trim().toLowerCase() === 'yes') {
        erroneousFields.flags['severeAllergy'] = true; // Flag for life threatening allergy
    } else if (lifeThreateningAllergy && lifeThreateningAllergy.trim().toLowerCase() !== 'no') {
        //something is there but not yes or no
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('lifeThreateningAllergy');
        erroneousFields.fields_erroneous_n_description.set('lifeThreateningAllergy', 'Invalid: Life threatening allergy must be "Yes" or "No". Something seriously wrong.');
    }

    return erroneousFields;
}

/**
 * Checks if the dietary information is valid.
 * A dietary information is always valid, but wont add if no preference is selected
 * adds dietary information to FBMGuest.cf_guests_459373e1d1
 * @param dietaryInformation - The dietary information to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidDietaryInformation(dietaryInformation: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    if (dietaryInformation && dietaryInformation.trim() !== '') {
        erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Notes Provided by Guest: ' + dietaryInformation.trim());
    }
    return erroneousFields;
}

/**
 * Checks if the baby services is valid.
 * A baby services is invalid if not yes, no null or empty string
 * sets FBMGuest.cf_guests_e8827ca4cf to '1' or '0'
 * @param babyServices - The baby services to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidBabyServices(babyServices: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (babyServices === undefined || babyServices === null || babyServices.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }
    if (babyServices.trim().toLowerCase() === 'yes') {
        erroneousFields.FBMGuest.cf_guests_e8827ca4cf = '1';
    } else if (babyServices.trim().toLowerCase() !== 'no') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('babyServices');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_e8827ca4cf:babyServices', 'Invalid: Baby services must be "Yes" or "No". Something seriously wrong.');
    } else {
        erroneousFields.FBMGuest.cf_guests_e8827ca4cf = '0'; // Set to 0 if no baby services needed
    }

    return erroneousFields;
}

/**
 * checks if the adult diapers question is valid
 * A adult diapers question is never invalid
 * adds to FBMGuest.cf_guests_459373e1d1
 * @param adultDiapers - The adult diapers question to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidAdultDiapers(adultDiapers: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (adultDiapers === undefined || adultDiapers === null || adultDiapers.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    if (adultDiapers.trim().toLowerCase() === 'no') {
        //dont push anything if no adult diapers needed
    } else {
        erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Adult Diapers: ' + adultDiapers.trim());
    }

    return erroneousFields;
}


/**
 * Client is invalid if its missing any of the first names or ages, or in other words if there is a field
 * with the 1st member's first name, 1st member's last name, 1st member's age, etc.
 * It needs to have the first name and age exist as well.
 * @param client - The client object containing household member information.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidHouseholdMembers(client: Client, inputErroneousFields: Erroneous): Erroneous {
    let erroneousFields = copyErroneous(inputErroneousFields);
    // extract all the household members from the client object
    let last_name_hoh: string | undefined | null = client.get("Head of Household Last Name");
    if (!last_name_hoh || last_name_hoh.trim() === '') {
        // should never happen, but just in case
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('lastname');
        erroneousFields.fields_erroneous_n_description.set('lastname', 'Invalid: Missing or empty last name.');
        //wont matter as last name is still critical and will be caught by later function
    }
    const householdMembers: Array<{ firstName: string | undefined | null, lastName: string | undefined | null, age: string | undefined | null, number: number }> = [];
    const householdMemberKeys = Array.from(client.keys()).filter(key => key.match(/\d+(?:st|nd|rd|th) member's.*/i));
    householdMemberKeys.forEach(memberKey => {
        const match = memberKey.match(/(\d+)(?:st|nd|rd|th) member's.*/i);
        if (match) {
            const memberNumber: number = parseInt(match[1], 10);
            //extract suffix
            const suffix: string = memberKey.match(/(\d+)(?:st|nd|rd|th)/)?.[0] || `${memberNumber}th`;
            //now can easily parse
            const firstName: string | null | undefined = client.get(`${suffix} member's first name`);
            let lastName: string | null | undefined = client.get(`${suffix} member's last name`);
            const age: string | null | undefined = client.get(`${suffix} member's age`);
            if ((lastName === undefined || lastName === null || lastName.trim() === '') && (age && age.trim() !== '') && (firstName && firstName.trim() === '')) {
                lastName = last_name_hoh; // If no last name, use the head of household's last name
            }
            householdMembers.push({ firstName, lastName, age, number: memberNumber });
        }
    });

    householdMembers.forEach(member => {
        const { erroneous, member: updatedMember, memberEmpty } = isMemberMissingImportantField(member, erroneousFields);
        erroneousFields = erroneous;
        if (memberEmpty) {
            // no need to validate empty members
        } else {
            //now member is guarenteed to have all of its fields strings
            erroneousFields = isValidMemberFirstName(updatedMember, erroneousFields);
            erroneousFields = isValidMemberLastName(updatedMember, erroneousFields);
            erroneousFields = isValidMemberAge(updatedMember, erroneousFields);
            const headofhouseholdFirstName = client.get("Head of Household First Name");
            const headofhouseholdAge = client.get("Head of Household Age");
            erroneousFields = isHeadOfHouseholdMember(updatedMember, erroneousFields, headofhouseholdFirstName, headofhouseholdAge);
        }
    });
    return erroneousFields;
}

/**
 * Checks if a household member is missing important fields.
 * if every field is null then its gucci
 * A household member is missing important fields if the first name or age is missing.
 * updates household member's erroneous fields
 * @param member - The household member object containing first name, age, last name, and number.
 * @param erroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isMemberMissingImportantField(member: { firstName: string | null | undefined, age: string | null | undefined, lastName: string | null | undefined, number: number }, inputErroneousFields: Erroneous): { erroneous: Erroneous, member: { firstName: string, age: string, lastName: string, number: number }, memberEmpty: boolean } {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    // if all fields are null, empty or undefined, then its gucci
    if ((member.firstName === undefined || member.firstName === null || member.firstName.trim() === '') &&
        (member.age === undefined || member.age === null || member.age.trim() === '') &&
        (member.lastName === undefined || member.lastName === null || member.lastName.trim() === '')) {
        return { erroneous: erroneousFields, member: { firstName: member.firstName || '', age: member.age || '', lastName: member.lastName || '', number: member.number }, memberEmpty: true };
    }
    //if a single field is missing, then its invalid
    if (!member.firstName || member.firstName.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'FirstName');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'FirstName', 'Invalid: Missing or empty first name for a household member.');
    }
    if (!member.age || member.age.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'Age');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'Age', 'Invalid: Missing or empty age for a household member.');
    }
    if (!member.lastName || member.lastName.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'LastName');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'LastName', 'Invalid: Missing or empty last name for a household member.');
    }

    //now put all the data into erroneous fields that we can

    return { erroneous: erroneousFields, member: { firstName: member.firstName || '', age: member.age || '', lastName: member.lastName || '', number: member.number }, memberEmpty: false };
}

/**
 * Checks if the first name of a household member is valid.
 * A first name is invalid if it contains only whitespace or if it contains any digits.
 * returns the first name
 * @param member - The member, guaranteed to have a first name, age and last name
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns erroneousFields- The updated erroneous fields.
 * @throws error if the string is empty or contains only whitespace.
 */
export function isValidMemberFirstName(member: { firstName: string, age: string, lastName: string, number: number }, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (member.firstName.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'FirstName');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'FirstName', 'Invalid: Missing or empty first name for a household member.');
        return erroneousFields; // If the first name is empty, we don't need to check further
    }
    if (/\d/.test(member.firstName)) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'FirstName');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'FirstName', 'First name contains digits.');
    }
    return erroneousFields;
}

/**
 * Checks if the last name of a household member is valid.
 * A last name is invalid if it contains only whitespace or if it contains any digits.
 * returns the last name
 * @param member - The member, guaranteed to have a first name, age and last name
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns erroneousFields- The updated erroneous fields.
 * @throws error if the string is empty or contains only whitespace.
 */
export function isValidMemberLastName(member: { firstName: string, age: string, lastName: string, number: number }, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (member.lastName.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'LastName');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'LastName', 'Invalid: Missing or empty last name for a household member.');
        return erroneousFields;
    }
    if (/\d/.test(member.lastName)) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'LastName');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'LastName', 'Last name contains digits.');
    }
    return erroneousFields;
}

/**
 * Checks if the age of a household member is valid.
 * An age is invalid if it is not a valid integer or if it is less than 0.
 * returns the age
 * @param member - The member, guaranteed to have a first name, age and last name
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns erroneousFields- The updated erroneous fields.
 * @throws error if the string is empty or contains only whitespace.
 */
export function isValidMemberAge(member: { firstName: string, age: string, lastName: string, number: number }, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (member.age.trim() === '') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'Age');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'Age', 'Invalid: Missing or empty age for a household member.');
        return erroneousFields; // If the age is empty, we don't need to check further
    }
    if (!/^\d+$/.test(member.age)) {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('member' + member.number + 'Age');
        erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'Age', 'Age must be a valid integer.');
    } else {
        const age: number = parseInt(member.age, 10);
        if (age < 0) {
            erroneousFields.flags['invalid'] = true;
            erroneousFields.fields_invalid.add('member' + member.number + 'Age');
            erroneousFields.fields_erroneous_n_description.set('othersHousehold:member' + member.number + 'Age', 'Age must be a positive integer.');
        }
    }
    return erroneousFields;
}

/**
 * Checks if the household member is the head of household.
 * A head of household is defined by the first name and age of the head of household.
 * just records the error in erroneous fields
 * @param member - The member, guaranteed to have a first name, age and last name
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @param headofhouseholdFirstName - The first name of the head of household.
 * @param headofhouseholdAge - The age of the head of household.
 * @returns erroneousFields- The updated erroneous fields.
 */
export function isHeadOfHouseholdMember(member: { firstName: string, age: string, lastName: string, number: number }, inputErroneousFields: Erroneous, headofhouseholdFirstName: string | null | undefined, headofhouseholdAge: string | null | undefined): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);

    if (member.firstName.trim().toLowerCase() === headofhouseholdFirstName?.trim().toLowerCase() && member.age.trim() === headofhouseholdAge?.trim()) {
        erroneousFields.flags['duplicate'] = true; // Flag for duplicate head of household
        erroneousFields.flags['hohInMembers'] = true; // Flag for head of household in members
        erroneousFields.fields_invalid.add('member' + member.number);
        erroneousFields.fields_erroneous_n_description.set('member' + member.number, 'Invalid: Household member is the head of household, should not be included in the list of members.');
    }
    return erroneousFields;
}

// all the ones i have left:
// erroneousFields = isValidDiaperSize(client.get("What size diapers does your baby(s) need?"), erroneousFields);
//     erroneousFields = isValidBabyFood(client.get("Do You Need Baby Food?"), erroneousFields);
//     erroneousFields = isValidBabyFormula(client.get("Do You Need Baby Formula?"), erroneousFields);
//     erroneousFields = isValidFormulaType(client.get("If yes, what type?"), erroneousFields);
//     erroneousFields = isValidDogFood(client.get("Do you need dog food?"), erroneousFields);
//     erroneousFields = isValidCatFood(client.get("Do you need cat food?"), erroneousFields);
//     erroneousFields = isValidAcknowledgment(client.get("I acknowledge"), erroneousFields);

//     erroneousFields = isValidMemberFirstName(client.get("member's first name"), erroneousFields);
//     erroneousFields = isValidMemberLastName(client.get("member's last name"), erroneousFields);
//     erroneousFields = isValidMemberAge(client.get("member's age"), erroneousFields);
//     erroneousFields = isValidHouseholdCount(client.get("Yes, I have over 10 individuals in my household"), erroneousFields);

/**
 * checks if the diaper size is valid.
 * A diaper size is invalid if it is not one of the following:
 * is a string seperated by commas
 * 'New Born', '1', '2', '3', 'Size 4', '5', '6', 'Pull-Ups'
 * adds diaper size to FBMGuest.cf_guests_459373e1d1
 * @param diaperSize - The diaper size to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidDiaperSize(diaperSize: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (diaperSize === undefined || diaperSize === null || diaperSize.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }

    const validSizes = ['new born', '1', '2', '3', '4', '5', '6', 'pull-ups'];
    const sizes: string[] = diaperSize.split(',').map(size => size.trim().toLowerCase());
    const uniqueSizes = new Set(sizes); // Remove duplicates
    if (erroneousFields.FBMGuest.cf_guests_459373e1d1 === undefined) {
        erroneousFields.FBMGuest.cf_guests_459373e1d1 = []; // Initialize as an empty array if not already set
    }
    const adding_diaperSize: string[] = [];
    let invalid: boolean = false;
    uniqueSizes.forEach(size => {
        if (!validSizes.includes(size)) {
            erroneousFields.flags['erroneous'] = true;
            erroneousFields.fields_invalid.add('diaperSize');
            erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:diaperSize', 'Invalid: Diaper size contains invalid/unsupported options.');
            invalid = true;
        } else {
            //if it is a number
            if (size.trim().toLowerCase() === 'pull-ups') {
                adding_diaperSize.push(size.trim());
            } else {
                adding_diaperSize.push('Diaper Size: ' + size);
            }
        }
    });
    if (invalid) {
        return erroneousFields; // If any size is invalid, return without adding to FBMGuest
    }
    erroneousFields.FBMGuest.cf_guests_459373e1d1 = adding_diaperSize;
    return erroneousFields;
}

/**
 * checks if the baby food is valid.
 * A baby food is invalid if it is not one of the following:
 * yes, no, null, undefined or empty string
 * adds baby food to FBMGuest.cf_guests_459373e1d1 if yes
 * @param babyFood - The baby food to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidBabyFood(babyFood: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (babyFood === undefined || babyFood === null || babyFood.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }

    const validResponses = ['yes', 'no'];
    if (!validResponses.includes(babyFood.trim().toLowerCase())) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('babyFood');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:babyFood', 'Invalid: Baby food contains invalid/unsupported options.');
    } else {
        if (babyFood.trim().toLowerCase() === 'yes') {
            if (!erroneousFields.FBMGuest.cf_guests_459373e1d1) {
                erroneousFields.FBMGuest.cf_guests_459373e1d1 = [];
            }
            erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Baby Food');
        } else {
            //do nothing
        }
    }
    return erroneousFields;
}

/**
 * checks if the baby formula is valid.
 * A baby formula is invalid if it is not one of the following:
 * yes, no, null, undefined or empty string
 * adds baby formula to FBMGuest.cf_guests_459373e1d1 if yes
 * @param babyFormula - The baby formula to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidBabyFormula(babyFormula: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (babyFormula === undefined || babyFormula === null || babyFormula.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }

    const validResponses = ['yes', 'no'];
    if (!validResponses.includes(babyFormula.trim().toLowerCase())) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('babyFormula');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:babyFormula', 'Invalid: Baby formula contains invalid/unsupported options.');
    } else {
        if (babyFormula.trim().toLowerCase() === 'yes') {
            if (!erroneousFields.FBMGuest.cf_guests_459373e1d1) {
                erroneousFields.FBMGuest.cf_guests_459373e1d1 = [];
            }
            erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Baby Formula');
        } else {
            //do nothing
        }
    }
    return erroneousFields;
}

/**
 * checks if the formula type is valid.
 * A formula type is invalid if it is not one of the following:
 * Powder, Liquid, Ready-to-Feed, null, undefined or empty string
 * adds formula type to FBMGuest.cf_guests_459373e1d1
 * @param formulaType - The formula type to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidFormulaType(formulaType: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (formulaType === undefined || formulaType === null || formulaType.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }

    const validTypes = ['powder', 'liquid', 'ready-to-feed'];
    if (!validTypes.includes(formulaType.trim().toLowerCase())) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('formulaType');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:formulaType', 'Invalid: Formula type contains invalid/unsupported options.');
    } else {
        if (!erroneousFields.FBMGuest.cf_guests_459373e1d1) {
            erroneousFields.FBMGuest.cf_guests_459373e1d1 = [];
        }
        erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Formula Type: ' + formulaType.trim());
    }
    return erroneousFields;
}

/**
 * checks if the dog food is valid.
 * A dog food is invalid if it is not one of the following:
 * yes, no, null, undefined or empty string
 * adds dog food to FBMGuest.cf_guests_459373e1d1 if yes
 * @param dogFood - The dog food to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidDogFood(dogFood: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (dogFood === undefined || dogFood === null || dogFood.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }

    const validResponses = ['yes', 'no'];
    if (!validResponses.includes(dogFood.trim().toLowerCase())) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('dogFood');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:dogFood', 'Invalid: Dog food contains invalid/unsupported options.');
    } else {
        if (dogFood.trim().toLowerCase() === 'yes') {
            if (!erroneousFields.FBMGuest.cf_guests_459373e1d1) {
                erroneousFields.FBMGuest.cf_guests_459373e1d1 = [];
            }
            erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Dog Food: ' + dogFood.trim());
        } else {
            //do nothing if no dog food needed
        }
    }
    return erroneousFields;
}

/**
 * checks if the cat food is valid.
 * A cat food is invalid if it is not one of the following:
 * yes, no, null, undefined or empty string
 * adds cat food to FBMGuest.cf_guests_459373e1d1 if yes
 * @param catFood - The cat food to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 */
export function isValidCatFood(catFood: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (catFood === undefined || catFood === null || catFood.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }

    const validResponses = ['yes', 'no'];
    if (!validResponses.includes(catFood.trim().toLowerCase())) {
        erroneousFields.flags['erroneous'] = true;
        erroneousFields.fields_invalid.add('catFood');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:catFood', 'Invalid: Cat food contains invalid/unsupported options.');
    } else {
        if (catFood.trim().toLowerCase() === 'yes') {
            if (!erroneousFields.FBMGuest.cf_guests_459373e1d1) {
                erroneousFields.FBMGuest.cf_guests_459373e1d1 = [];
            }
            erroneousFields.FBMGuest.cf_guests_459373e1d1.push('Cat Food: ' + catFood.trim());
        } else {
            //do nothing if no cat food needed
        }
    }
    return erroneousFields;
}

/**
 * checks if the acknowledgment is valid.
 * A acknowledgment is invalid if it is not one of the following:
 * yes (literally just yes)
 * adds acknowledgment to FBMGuest.cf_guests_1fb4745f10 if yes
 * @param acknowledgment - The acknowledgment to be checked.
 * @param inputErroneousFields - The current erroneous fields to be updated.
 * @returns The updated erroneous fields.
 */
export function isValidAcknowledgment(acknowledgment: string | null | undefined, inputErroneousFields: Erroneous): Erroneous {
    const erroneousFields = copyErroneous(inputErroneousFields);
    if (acknowledgment === undefined || acknowledgment === null || acknowledgment.trim() === '') {
        //dont do nothing
        return erroneousFields;
    }
    if (acknowledgment.trim().toLowerCase() !== 'yes') {
        erroneousFields.flags['invalid'] = true;
        erroneousFields.fields_invalid.add('acknowledgment');
        erroneousFields.fields_erroneous_n_description.set('cf_guests_459373e1d1:acknowledgment', 'Invalid: Acknowledgment must be "Yes". Something seriously wrong.');
    } else {
        //default to provided
        // if (!erroneousFields.FBMGuest.cf_guests_459373e1d1) {
        //     erroneousFields.FBMGuest.cf_guests_459373e1d1 = [];
        // }
        // erroneousFields.FBMGuest.cf_guests_1fb4745f10.set(['Provided']);
    }
    return erroneousFields;
}




// /**
//  * Checks if a client is erroneous based on each field.
//  * know that required fields are not null or empty
//  * @param {Client} client - The client to be checked.
//  * @returns {Erroneous} - An object indicating whether the client is erroneous. or null if not.
//  */
// export function _isInvalidErroneous(client: Client): Erroneous | null {

//     const fields_erroneous: string[] = [];
//     //get rid of white space and punctuation
//     //guarenteed to not be null or empty
//     const firstName: string = client.get('Head of Household First Name')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const lastName: string = client.get('Head of Household Last Name')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const dob: string = client.get('Head of Household Date of Birth')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const city: string = client.get('Head of Household City:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const zip: string = client.get('Head of Household Zip code:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const county: string = client.get('Head of Household County:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const street: string = client.get('Head of Household Street:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const householdSize: string = client.get('Other than the Head of Household, how many people in their/your household?')!.trim().replace(/[^\w\s]|_/g, '') || '';


//     //might not be there
//     const apt: string | undefined = client.get('Head of Household APT # (if Applicable):')?.trim().replace(/[^\w\s]|_/g, '') || undefined;
//     const cf_guests_901d83d3c7: string | undefined = client.get('CF Guests 901d83d3c7')?.trim().replace(/[^\w\s]|_/g, '') || undefined;

//     if (_isFirstNameErroneous(client)) {
//         fields_erroneous.push('Head of Household First Name');
//     }
//     // if (_isLastNameErroneous(client)) {
//     //     fields_erroneous.push('Head of Household Last Name');
//     // }

//     return { FBMGuest: {} as FBMGuest, fields_erroneous };
// }

// /**
//  * Checks if the last name is erroneous.
//  * @param {Client} client - The client to be checked.
//  * @returns {String, | null } - True if the last name is erroneous, false otherwise.
//  */
// export function _isFirstNameErroneous(client: Client): String, {
//     const firstName = client.get('Head of Household First Name');
//     return !firstName || firstName.trim() === '';
// }

/**
 * Flags erroneous clients for further review.
 * sets the flag cache to a list of clients that are erroneous.
 * @param {Clients} clients - The set of clients to be processed.
 * @returns {Set<Erroneous>} - A set of clients that are not erroneous. ready to be sent to FBM.
 */
export function flagger(clients: Clients): Set<Erroneous> {
    const erroneousClients: Set<Erroneous> = new Set();
    const validClients: Clients = new Set();
    const invalidClients: Clients = new Set();
    //want to check if each client is erroneous
    for (const client of clients) {
        //check if the client is valid
        const Erroneous_fields: Erroneous = emptyErroneous();
        const invalid_taken_care_of: Erroneous = _invalidChecker(client, Erroneous_fields);
        //check for duplicates maybe;
        erroneousClients.add(invalid_taken_care_of);
    }
    return erroneousClients;
}

// /**
//  * Checks if all required fields are present in the client.
//  * leaves a description of the it being invalid in Erroneous_fields.fields_erroneous_n_description, which is a map<string, string>
//  * @param {Client} client - The client to be checked.
//  * @param {Erroneous} Erroneous_fields - The object to store erroneous fields.
//  * returns nothing, but modifies Erroneous_fields
//  */
// export function _requiredFieldsThere(client: Client, Erroneous_fields: Erroneous): void {
//     //Check if all the required fields are there and put same error description
//     const rawMissingFields: Erroneous = _allRequiredFieldsThere(client,Erroneous_fields);
//     const missingFields: Set<string> = _requiredFieldsToFBM(rawMissingFields);
//     if (missingFields.size > 0) {

//         //add the missing fields to the Erroneous_fields
//         missingFields.forEach(field => {
//             Erroneous_fields.fields_erroneous_n_description.set(field, `Invalid: Missing required field: ${field}`);
//             Erroneous_fields.fields_invalid.add(field);
//         });
//     }
// }

/**
 * Maps missing field names to FBM field names.
 * @param missingFields - A set of missing field names, can only be part of required fields
 * @returns A set of FBM field names.
 * @throws {Error} If a field is not found in the mapping.
 */
export function _requiredFieldsToFBM(missingFields: Set<string>): Set<string> {
    // Map the missing field names to FBM field names if needed
    // For now, just return the same set, but you can map as needed
    // Example mapping:
    // 'Head of Household First Name' -> 'firstname'
    // 'Head of Household Last Name' -> 'lastname'
    // 'Head of Household Date of Birth' -> 'dob'
    // 'Head of Household City:' -> 'city'
    // 'Head of Household Zip code:' -> 'zip'
    // 'Head of Household County:' -> 'county'
    // 'Head of Household Street:' -> 'street'
    // 'Other than the Head of Household, how many people in their/your household?' -> 'householdSize'



    const fbmFields = new Set<string>();
    for (const field of missingFields) {
        if (fieldMap[field]) {
            fbmFields.add(fieldMap[field]);
        } else {
            throw new Error(`Field not found for: ${field}, this should be impossible`);
        }
    }

    return fbmFields;
}

/**
 * Maps a single missing field name to its corresponding FBM field name.
 * @param missingFields - A string representing a missing field name.
 * @returns The corresponding FBM field name.
 * @throws {Error} If the field is not found in the mapping.
 */
export function _requiredFieldsToFBMString(missingFields: string): string {
    // Map the missing field names to FBM field names if needed
    // For now, just return the same set, but you can map as needed
    // Example mapping:
    // 'Head of Household First Name' -> 'firstname'
    // 'Head of Household Last Name' -> 'lastname'
    // 'Head of Household Date of Birth' -> 'dob'
    // 'Head of Household City:' -> 'city'
    // 'Head of Household Zip code:' -> 'zip'
    // 'Head of Household County:' -> 'county'
    // 'Head of Household Street:' -> 'street'
    // 'Other than the Head of Household, how many people in their/your household?' -> 'householdSize'
    if (fieldMap[missingFields]) {
        return fieldMap[missingFields];
    } else {
        throw new Error(`Field not found for: ${missingFields}, this should be impossible`);
    }



}