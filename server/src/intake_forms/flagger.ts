// import { Clients, Client, FlagRecord, requiredFields } from './custom_types'; // Assume you have a Client type defined somewhere
// import { FBMGuest } from '../../routes/helper';
// //import { saveFlagRecord } from './flagRecordService'; // Assume this saves flag records to your server
// //import { sendToFBM } from './fbmService'; // Assume this sends clients to FBM


// /**simply check to see if required fields are there
//  * @param {Client} client - The client to be checked.
//  * @returns {boolean} - True if all required fields are present, false otherwise.
//  */
// export function _allRequiredFieldsThere(client: Client): boolean {
//     // const requiredFields = [
//     //     'Timestamp',
//     //     'Head of Household County:',
//     //     'Head of Household First Name',
//     //     'Head of Household Last Name',
//     //     'Head of Household Date of Birth',
//     //     'Head of Household City:',
//     //     'Head of Household Zip code:',
//     //     'Other than the Head of Household, how many people in their/your household?'
//     // ];

//     for (const field of requiredFields) {
//         if (!client.has(field) || client.get(field) === null || client.get(field) === '') {
//             return false;
//         }
//     }
//     return true;
// }



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
//     const firstName:string = client.get('Head of Household First Name')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const lastName:string = client.get('Head of Household Last Name')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const dob:string = client.get('Head of Household Date of Birth')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const city:string = client.get('Head of Household City:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const zip:string = client.get('Head of Household Zip code:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const county:string = client.get('Head of Household County:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const street:string = client.get('Head of Household Street:')!.trim().replace(/[^\w\s]|_/g, '') || '';
//     const householdSize:string = client.get('Other than the Head of Household, how many people in their/your household?')!.trim().replace(/[^\w\s]|_/g, '') || '';


//     //might not be there
//     const apt:string|undefined = client.get('Head of Household APT # (if Applicable):')?.trim().replace(/[^\w\s]|_/g, '') || undefined;
//     const cf_guests_901d83d3c7:string|undefined = client.get('CF Guests 901d83d3c7')?.trim().replace(/[^\w\s]|_/g, '') || undefined;

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
// export function _isFirstNameErroneous(client: Client): String,  {
//     const firstName = client.get('Head of Household First Name');
//     return !firstName || firstName.trim() === '';
// }

// /**
//  * Flags erroneous clients for further review.
//  * sets the flag cache to a list of clients that are erroneous.
//  * @param {Clients} clients - The set of clients to be processed.
//  * @returns {Clients} - A set of clients that are not erroneous. ready to be sent to FBM.
//  */
// export function flagger(clients: Clients): Clients {
//     const erroneousClients: Set<FlagRecord> = new Set();
//     const validClients: Clients = new Set();
//     //want to check if each client is erroneous
//     for (const client of clients) {
//         //check if the client is valid
//         if(!_allRequiredFieldsThere(client)){
//             const flagRecord: FlagRecord = {
//                 client,
//                 description: 'Missing required fields',
//                 timestamp: new Date(),
//             };
//             erroneousClients.add(flagRecord);
//             break;
//         }
//         //check if any of the fields are erroneous
//         const flagDescription = _isInvalidErroneous(client);
//         if (flagDescription) {
//             const flagRecord: FlagRecord = {
//                 client,
//                 description: flagDescription,
//                 timestamp: new Date(),
//             };
//             erroneousClients.add(flagRecord);
//         }
//     }
//     return erroneousClients;
// }

// export async function processClients(clients: Clients): Promise<void> {
//     const validClients: Client[] = [];
//     for (const client of clients) {
//         const flagDescription = isErroneous(client);
//         if (flagDescription) {
//             const flagRecord: FlagRecord = {
//                 clientId: client.id,
//                 description: flagDescription,
//                 timestamp: new Date(),
//             };
//             await saveFlagRecord(flagRecord);
//         } else {
//             validClients.push(client);
//         }
//     }
//     if (validClients.length > 0) {
//         await sendToFBM(validClients);
//     }
// }