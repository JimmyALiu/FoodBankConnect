import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import type { GaxiosResponse } from 'gaxios';
import path from 'path';
import fs, { rm } from 'fs';
import { Clients } from './custom_types.js'; // Import the Clients type

// For ESModule support
const __dirname: string = path.resolve();

// Construct path relative to project root or wherever your `src` is
let keyPath: string;
let auth: JWT;
let sheets: sheets_v4.Sheets;

const sheetName: string = 'Form Responses 1';
const range: string = sheetName + '!A1:D10';
const spreadsheetId: string = '1DXaJkja09LL5AMpoNKFsxeJfx8GcNZ1v9qzPYzDlvW0';

try {
    keyPath = path.resolve(__dirname, '../.env/food-bank-connect-b725637de6a2.json');
    auth = new JWT({
        keyFile: keyPath, // key file path
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],//read only access alter to write access by deleting readonly
    });
    sheets = google.sheets({ version: 'v4', auth });



} catch (error) {
    console.log('Key doesnt exist in current .env');
}

//check if the file exists


// Load credentials from service account JSON


/**  Function to test reading from a Google Sheets document.*/
export async function testSheet(): Promise<boolean> {
    try {
        //get the entire data from the sheet
        const res: GaxiosResponse<sheets_v4.Schema$ValueRange> = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: range,
        });
        return res.status === 200; // Check if the request was successful
        //console.log('Data from sheet:', res.data.values);
    } catch (error) {
        console.error('Error reading sheet:', error);
        return false;
    }
}

/**
 * Function to get all data from the sheet and process it into a set of hashmaps so it becomes a client object
 * @throws {Error} - Throws an error if the request fails.
 * @returns {Clients} - Returns a set of clients or null if there was an error.
 */
export async function getClients(): Promise<Clients> {

    const raw: string[][] | null = await getSheetData();
    // Check if rows is null or undefined
    if (!raw) {
        throw new Error('No data found in the sheet');
    }
    const rawHeaders: string[] = raw[0]; // First row is headers
    const clients: Clients = aggregateFamilyMemberData(rawHeaders, raw.slice(1)); // Remaining rows are data

    return removeEmptyStringsAndRows(clients);

}

/**
 * Function to change empty strings to null and remove rows with no timestamp from the set of clients
 * @param {Clients} clients - The set of clients
 * @returns {Clients} - Returns a set of clients with empty strings and rows removed
 */
export function removeEmptyStringsAndRows(clients: Clients): Clients {
    if (clients === undefined) {
        throw new Error('No data found in the sheet');
    }
    const filteredClients: Clients = new Set<Map<string, any>>();
    clients.forEach((client) => {
        const filteredClient: Map<string, any> = new Map<string, any>();
        let hasData: boolean = true;
        if (!client.has('Timestamp')) {
            //should never happen
            throw new Error('No Timestamp found in the client data, check to see if spreadsheet header is missing timestamp column');
        }
        client.forEach((value, key) => {
            if (value === '' || value === undefined) {
                filteredClient.set(key, null);
            } else {
                filteredClient.set(key, value);
            }
            if (key === 'Timestamp' && (value === '' || value === null || value === undefined)) {
                // Means the row is empty so discard it
                hasData = false;
            }
        });
        // If it has data then add it to the set
        if (hasData) {
            filteredClients.add(filteredClient);
        }
    });
    return filteredClients;
}

/**
 * Function to convert the rows from the sheet into a set of clients
 * we know that rows and rawhearders are mutually exclusive
 * rows and rawHeaders may not necessarily be the same length
 * @throws {Error} - if rows[0] is the same as rawHeaders
 * @param {string[][]} rows - The rows from the sheet
 * @param {string[]} rawHeaders - The headers from the sheet
 * @returns {Clients} - Returns a set of clients or null if there was an error. All raw headers are in this set. expect there to be '' and null in data set
 */
export function aggregateFamilyMemberData(rawHeaders: string[], rows: string[][]): Clients {
    // Check if rows and rawHeaders are mutually exclusive
    // if (rawHeaders.length !== rows[0].length) {
    //     //means there is no data for the headers, making them worthless
    //     rawHeaders = rawHeaders.slice(0, rows[0].length);
    // }
    if (rows.length === 0) {
        //throw new Error('No data found in the sheet');
        //need to match the type structure
        const empty: Map<string, any> = new Map<string, any>();
        const set: Set<Map<string, any>> = new Set<Map<string, any>>();
        set.add(empty);
        return set; // Return an empty set if no data is found
    }

    if (rawHeaders.length < rows[0].length) {
        throw new Error('means there is more data than headers? what is going on? AHHHHHHHHHH!');
    }


    if (rows[0].length !== 0 && rows[0].every((value, index) => value === rawHeaders[index])) {
        throw new Error('forgot to slice the first row');
    }

    //all headers start with "1st member" until it reaches max and then starts counting up again
    // there are 10 members at max
    //need an array of all columns which matches each family member

    const familyMemberIndexes: Map<string, number[]> = getFamilyMemberIndexes(rawHeaders);
    //assuming no repeated family members
    const allFamilyIndexs: number[] = Array.from(familyMemberIndexes.values()).reduce((acc, val) => acc.concat(val), []);

    //just need to grab the non family member data straight up
    const nonFamilyMemberHeaders: string[] = rawHeaders.filter((header, index) => !allFamilyIndexs.includes(index) && header !== ''); // Filter out family member headers and empty strings
    //should still work as rows.length<= rawHeaders.length
    const nonFamilyMemberData: Array<Map<string, string | null>> = rows.map((row) =>
        new Map(
            nonFamilyMemberHeaders.map((header) => {
                const index = rawHeaders.indexOf(header);
                return [
                    header,
                    index < row.length ? row[index] : null // Add null if index is out of bounds
                ];
            })
        )
    );

    //now for each rows[i] we need to get the family member data
    //need to check each column associated with the string array
    //only one of these columns should be filled with data
    //throws an error if more than one column is filled with data
    const family_data: Array<Map<string, number>> = findFamilyData(familyMemberIndexes, rows);

    //now need to combine family data with non family member data
    //the indexes should match up

    //set all the family data into the non family member data
    nonFamilyMemberData.forEach((row, index) => {
        const rfd: Map<string, number> = family_data[index];
        //need to get relevant family member data
        rfd.forEach((value, key) => {
            if (value === -1) {
                //means the family member was not found
                row.set(key, null);
            }
            row.set(key, rows[index][value]);
        });
    });

    //convert array into a set
    const clientSet: Clients = new Set<Map<string, any>>();
    nonFamilyMemberData.forEach((row) => {
        clientSet.add(row);
    });

    return clientSet;

}

/**
 * now for each rows[i] we need to get the family member data
 * need to check each column associated with the string array
 * only one of these columns should be filled with data
 * treat empty strings as null
 * will return a -1 for any family member that is not found
 * @throws{Error} if more than one column is filled with data
 * @param {Map<string, number[]>} familyMemberIndexes - The indexes of the family members
 * @param {string[][]} rows - The rows from the sheet
 * @returns {Array<Map<string, number>>} - Returns an array of maps of family members and indexes to their data. Will enable us to just use indexes to get the data
 */
export function findFamilyData(familyMemberIndexes: Map<string, number[]>, rows: string[][]): Array<Map<string, number>> {
    const family_data: Array<Map<string, number>> = new Array<Map<string, number>>();
    //INV: familyMemberIndexes is a map of family members and all of their indexes, no empty arrays
    for (let i = 0; i < rows.length; i++) {
        const row: string[] = rows[i];
        const familyMemberData: Map<string, number> = new Map<string, number>();
        familyMemberIndexes.forEach((values, key) => {
            // for each family member check all indexes
            // if the value is not null and another doesnt already exist then add it to the map
            // if the value is null then skip it
            // if two values are not null then throw an error
            values.forEach((index) => {
                if (row[index] !== null && row[index] !== '' && row[index] !== undefined) {
                    if (familyMemberData.has(key)) {
                        //could have the same value at multiple indexes, only an error if the value is not the same

                        if (row[familyMemberData.get(key)!] !== row[index]) {
                            throw new Error('inconsistent family data, ' + row[familyMemberData.get(key)!] + ', ' + row[index]);
                        }
                        //means the family member
                    }
                    familyMemberData.set(key, index);
                }
            });
            //expected to find some family members not included
            if (!familyMemberData.has(key)) {
                //means the family member was not found
                familyMemberData.set(key, -1);
            }
        });
        family_data.push(familyMemberData);

    }

    return family_data;
}



/**Factory, Given headers will out put a map which shows matches of all IgnoreCase("[1-9]*[1-9]<st|nd|rd|th> member".*)
 * returns a map of family members and their indexes
 * must ensure all headers are the same for all family members
 * converts to lowercase
 * @param {string[]} rawHeaders - The headers from the sheet
  */
export function getFamilyMemberIndexes(rawHeaders: string[]): Map<string, number[]> {
    return naiveFamilyMemberIndexes(rawHeaders);
}

/**very simple and slow algorithm to get all the family members indexes */
export function naiveFamilyMemberIndexes(rawHeaders: string[]): Map<string, number[]> {

    const familyMemberIndexes: Map<string, number[]> = new Map<string, number[]>();
    //INV: rawHeaders is a list of strings and contains relevant elements which match "[0-9]*[1-9]<st|nd|rd|th> member".* and features match
    for (let i = 0; i < rawHeaders.length; i++) {
        const headerog: string = rawHeaders[i];
        const header = headerog.toLowerCase();
        if (header.startsWith('1st member') || header.startsWith('2nd member') || header.startsWith('3rd member') || header.startsWith('4th member') || header.startsWith('5th member') || header.startsWith('6th member') || header.startsWith('7th member') || header.startsWith('8th member') || header.startsWith('9th member') || header.startsWith('10th member')) {
            // //gets the true data column name and then adds it to the map or appends the index to the array at an already occuring occurance
            // const key: string = header.slice(0, header.indexOf('member') + 6);
            //if the key is not in the map, add it
            if (!familyMemberIndexes.has(header)) {
                familyMemberIndexes.set(header, [i]);
            } else {
                //know the familymember is not null
                familyMemberIndexes.get(header)?.push(i);
            }
        }
    }

    return familyMemberIndexes;

}


/**
 * Functions reads data from a google sheets document. Will have access to all non empty rows and columns 
 * (may include some null values in rows preceding the last row/column)
 * @throws {Error} - Throws an error if the request fails.
 * @returns the data from the sheet as an array of objects or null if there was an error.
 */
export async function getSheetData(): Promise<string[][] | null> {
    // Create a JWT client

    try {
        const res: GaxiosResponse<sheets_v4.Schema$ValueRange> = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName
        });
        // was the response successful?
        if (res.status != 200) {
            throw new Error('Error reading sheet: ' + res.statusText);
        }

        // First row is headers
        const rows: string[][] = res.data.values as string[][];
        return rows;



        //console.log('Data from sheet:', res.data.values);
    } catch (error) {
        throw new Error('Error reading sheet: ' + error);
    }
}