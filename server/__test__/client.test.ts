//import { } from 'jest'; // Ensure Jest types are available
import { testSheet, getSheetData } from '../src/intake_forms/client_intake'; // Adjust the import path as necessary


// unmocked testing connection to google sheets
test('client intake test, spreadsheet connection working', async () => {
    const result = await testSheet();
    expect(result).toBe(true);
});

test('getsheetdata test', async () => {
    const result = await getSheetData();
    expect(result).toBeDefined();
});



