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
        const Erroneous_fields = emptyErroneous();
        // _requiredFieldsThere(client, Erroneous_fields)

        //will then check for all other invalid fields
        // _invalidChecker(client, Erroneous_fields);
        // //will then check for all erroneous fields
        // _erroneousChecker(client, Erroneous_fields);

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