import fs from 'fs';
import path from 'path';
import { jest } from "@jest/globals";
import { BACKUP_FILE, loadBackup, saveBackup } from '../src/toDisk';
import { internalFormGuests } from '../inMemoryStorage/cache';
import { client1, client2, client3, client4, } from './mock_clients';
import { assert } from 'console';
import { Erroneous, parseErroneous, stringifyErroneous } from '../src/intake_forms/custom_types';



// Ensure the backup file directory exists in the test environment
if (typeof BACKUP_FILE === 'string' && !fs.existsSync(BACKUP_FILE)) {
    const dir = path.dirname(BACKUP_FILE);
    if (typeof dir === 'string') {
        fs.mkdirSync(dir, { recursive: true });
    }
}

describe('toDisk module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        internalFormGuests.clear();
    });

    afterEach(() => {
        // Clean up the backup file after each test
        if (fs.existsSync(BACKUP_FILE)) {
            fs.unlinkSync(BACKUP_FILE);
        }
    });


    describe.each([
        { description: '0 clients', clients: [] },
        { description: '1 client 1', clients: [client1] },
        { description: '1 client 2', clients: [client2] },
        { description: '2 clients 1 and 2', clients: [client1, client2] },
        { description: '2 clients 1 and 3', clients: [client1, client3] },
        { description: '2 clients 2 and 3', clients: [client2, client3] },
        { description: '3 clients 1, 2 and 3', clients: [client1, client2, client3] },
        { description: '3 clients 1, 2 and 4', clients: [client1, client2, client4] },
        { description: '3 clients 1, 3 and 4', clients: [client1, client3, client4] },
        { description: '3 clients 2, 3 and 4', clients: [client2, client3, client4] },
        { description: '4 clients 1, 2, 3 and 4', clients: [client1, client2, client3, client4] },
    ])('saveBackup with $description', ({ clients }) => {
        it(`should save ${clients.length} clients to the backup file`, () => {
            internalFormGuests.clear();
            clients.forEach(client => internalFormGuests.add(client));
            //delete backup file if it exists
            if (fs.existsSync(BACKUP_FILE)) {
                fs.unlinkSync(BACKUP_FILE);
            }

            assert(fs.existsSync(BACKUP_FILE) === false, 'Backup file should not exist before saving');

            saveBackup();
            //expect the backup file to be created
            expect(fs.existsSync(BACKUP_FILE)).toBe(true);
        });

        it(`should log an error if saving ${clients.length} clients fails`, () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            // Simulate a failure by setting the backup file path to an invalid location
            const originalBackupFile = BACKUP_FILE;
            const invalidPath = '/invalid/path/to/backup.json';

            try {
                saveBackup(invalidPath);


                expect(consoleSpy).toHaveBeenCalledWith(
                    "Failed to save backup:",
                    expect.anything()
                );
            } finally {
                // Restore the original backup file path
                (global as any).BACKUP_FILE = originalBackupFile;
                consoleSpy.mockRestore();
            }
        });
    });

    describe('loadBackup', () => {
        describe.each([
            { description: '0 clients', clients: [] },
            { description: '1 client 1', clients: [client1] },
            { description: '1 client 2', clients: [client2] },
            { description: '2 clients 1 and 2', clients: [client1, client2] },
            { description: '2 clients 1 and 3', clients: [client1, client3] },
            { description: '2 clients 2 and 3', clients: [client2, client3] },
            { description: '3 clients 1, 2 and 3', clients: [client1, client2, client3] },
            { description: '3 clients 1, 2 and 4', clients: [client1, client2, client4] },
            { description: '3 clients 1, 3 and 4', clients: [client1, client3, client4] },
            { description: '3 clients 2, 3 and 4', clients: [client2, client3, client4] },
            { description: '4 clients 1, 2, 3 and 4', clients: [client1, client2, client3, client4] },
        ])('loadBackup with $description', ({ clients }) => {
            it('should load data from the backup file and populate internalFormGuests', () => {
                internalFormGuests.clear();
                clients.forEach(client => internalFormGuests.add(client));

                //already tested above
                saveBackup(); // Save the clients to the backup file

                internalFormGuests.clear(); // Clear before loading backup
                expect(internalFormGuests.size).toBe(0); // Ensure it's empty before loading
                loadBackup();

                expect([...internalFormGuests]).toEqual(clients);
            });

            it('should clear internalFormGuests and log a message if the backup file does not exist', () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
                //delete the backup file if it exists
                if (fs.existsSync(BACKUP_FILE)) {
                    fs.unlinkSync(BACKUP_FILE);
                }

                //need internalFormGuests to not be empty to test clearing
                clients.forEach(client => internalFormGuests.add(client));

                loadBackup();

                expect(internalFormGuests.size).toBe(0);
                expect(consoleSpy).toHaveBeenCalledWith('No backup file found. Starting fresh.');
                consoleSpy.mockRestore();
            });

            it('should log an error if the backup file contains invalid JSON', () => {
                const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
                // create file at backup location with invalid JSON
                const backupFilePath = BACKUP_FILE;
                fs.writeFileSync(backupFilePath, 'invalid json', 'utf-8');
                internalFormGuests.clear();
                clients.forEach(client => internalFormGuests.add(client));

                loadBackup();

                expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load backup:'), expect.any(Error));
                consoleSpy.mockRestore();
            });
        });
    });
});

describe('stringifyErroneous and parseErroneous', () => {
    const erroneousSamples: Erroneous[] = [
        client1, client2, client3, client4
    ];

    describe.each(erroneousSamples)('stringifyErroneous and parseErroneous with sample %#', (erroneous) => {
        it('should correctly stringify an Erroneous object', () => {
            const jsonString = stringifyErroneous(erroneous);
            const expectedString = JSON.stringify({
                timestamp: erroneous.timestamp,
                FBMGuest: erroneous.FBMGuest,
                fields_invalid: Array.from(erroneous.fields_invalid),
                fields_erroneous_n_description: Object.fromEntries(erroneous.fields_erroneous_n_description),
                flags: { ...erroneous.flags }
            });

            expect(jsonString).toBe(expectedString);
        });

        it('should correctly parse a JSON string into an Erroneous object', () => {
            const jsonString = stringifyErroneous(erroneous);
            const parsedErroneous = parseErroneous(jsonString);

            expect(parsedErroneous).toEqual(erroneous);
            expect(parsedErroneous.fields_invalid).toBeInstanceOf(Set);
            expect(parsedErroneous.fields_erroneous_n_description).toBeInstanceOf(Map);
        });

        it('should maintain data integrity after stringify and parse', () => {
            const jsonString = stringifyErroneous(erroneous);
            const parsedErroneous = parseErroneous(jsonString);

            expect(parsedErroneous).toEqual(erroneous);
        });
    });
});


