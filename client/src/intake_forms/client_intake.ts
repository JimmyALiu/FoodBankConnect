// sheets.js
import { google, } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as sheetsTypes from 'googleapis/build/src/apis/sheets/v4';
import type { GaxiosResponse } from 'gaxios';

// Load credentials from service account JSON
const auth = new JWT({
    keyFile: 'food-bank-connect-f4c7f19483d0.json', // key file path
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],//read only access alter to write access by deleting readonly
});

async function readSheet() {
    // Create a JWT client
    const sheets: sheetsTypes.sheets_v4.Sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId: string = '1DXaJkja09LL5AMpoNKFsxeJfx8GcNZ1v9qzPYzDlvW0';
    const range: string = 'Sheet1!A1:D10'; // ← replace with the range you want to read

    try {
        const res: GaxiosResponse<sheetsTypes.sheets_v4.Schema$ValueRange> = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        console.log('Data from sheet:', res.data.values);
    } catch (error) {
        console.error('Error reading sheet:', error);
    }
}

readSheet().catch(console.error);