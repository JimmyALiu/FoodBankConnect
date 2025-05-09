import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import type { GaxiosResponse } from 'gaxios';
import path from 'path';
import fs from 'fs';
import { Clients } from './custom_types'; // Import the Clients type

// For ESModule support
const __dirname: string = path.resolve();

// Construct path relative to project root or wherever your `src` is
const keyPath: string = path.resolve(__dirname, './secrets/food-bank-connect-f4c7f19483d0.json');

//check if the file exists


// Load credentials from service account JSON
const auth = new JWT({
    keyFile: keyPath, // key file path
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],//read only access alter to write access by deleting readonly
});

const sheetName: string = 'Form Responses 1'; // ← replace with the name of your sheet
const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

const spreadsheetId: string = '1DXaJkja09LL5AMpoNKFsxeJfx8GcNZ1v9qzPYzDlvW0';
const range: string = sheetName + '!A1:D10'; // ← replace with the range you want to read

// Check if the key file exists
if (!fs.existsSync(keyPath)) {
    console.error(`Key file not found at path: ${keyPath}`);
}

/**
 * Function to test reading from a Google Sheets document.
 * @async
 * @returns {Promise<boolean>} - Returns true if the sheet is read successfully, false otherwise.
 */
export async function testSheet(): Promise<boolean> {
    try {
        //get the entire data from the sheet
        const res: GaxiosResponse<sheets_v4.Schema$ValueRange> = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        });
        return res.status === 200; // Check if the request was successful
        //console.log('Data from sheet:', res.data.values);
    } catch (error) {
        console.error('Error reading sheet:', error);
        return false;
    }
}

// async function getSheetData(): Promise<Clients | null> {
//     // Create a JWT client

//     try {
//         const res: GaxiosResponse<sheets_v4.Schema$ValueRange> = await sheets.spreadsheets.values.get({
//             spreadsheetId,
//             range: sheetName
//         });
//         // was the response successful?
//         if (res.status != 200) {
//             throw new Error('Error reading sheet: ' + res.statusText);
//         }

//         // First row is headers
//         const rows: string[][] = res.data.values as string[][];


//         const headers = rows[0];

//         //console.log('Data from sheet:', res.data.values);
//     } catch (error) {
//         console.error('Error reading sheet:', error);
//         return false;
//     }
// }