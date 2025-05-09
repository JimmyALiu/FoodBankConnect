//import { } from 'jest'; // Ensure Jest types are available
import { testSheet } from '../src/intake_forms/client_intake'; // Adjust the import path as necessary
import test from 'node:test';
import { expect } from '@jest/globals';

test('dummy test', () => {
    expect(true).toBe(true);
});

test('client intake test, spreadsheet working', async () => {
    const result = await testSheet();
    expect(result).toBe(true);
});