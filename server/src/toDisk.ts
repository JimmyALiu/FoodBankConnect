import fs from 'fs';
import path from 'path';
import { Erroneous, parseErroneous, stringifyErroneous } from './intake_forms/custom_types';
import { internalFormGuests } from '../inMemoryStorage/cache';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
console.log(`dirname: ${__dirname}`);
export const BACKUP_FILE: string = path.join(__dirname.replace(/^\/[A-Za-z]:/, ''), '../inMemoryStorage/backup/formIntake.json');

// Initial in-memory data


/**
 * loads the backup file, will throw an error if the file is not valid JSON, not valid Erroneous or does not exist.
 * This function clears the existing internalFormGuests Set and populates it with the data from the backup file.
 * If the backup file does not exist, it will log a message and empty the set
 */
export function loadBackup(backupFile: string = BACKUP_FILE) {
    if (fs.existsSync(backupFile)) {
        try {
            const raw: Buffer = fs.readFileSync(backupFile);
            const parsed: Set<Erroneous> = _parse(raw.toString('utf-8'));
            internalFormGuests.clear(); // Clear existing data
            // Populate internalFormGuests with parsed data
            parsed.forEach(item => internalFormGuests.add(item));
            console.log("Backup loaded.");
        } catch (err) {
            console.error("Failed to load backup:", err);
        }
    } else {
        internalFormGuests.clear(); // Clear existing data if no backup file
        console.log("No backup file found. Starting fresh.");
    }
}

/**
 * save data to the backup file on disk.
 */
export function saveBackup(backupFile: string = BACKUP_FILE) {
    try {
        fs.writeFileSync(backupFile, _stringify(internalFormGuests), 'utf-8');
        console.log("Backup saved.");
    } catch (err: unknown) {
        console.error("Failed to save backup:", err);
    }
}

/**
 * takes in a set of erroneous objects and returns a stringified version of it.
 * this replaces JSON.stringify([...value]) to ensure that the custom objects are properly serialized.
 * This is necessary because JSON.stringify does not handle nested Sets and Maps directly.
 * @param value Set of objects to stringify
 * @returns Stringified version of the input set
 */
export function _stringify(value: Set<Erroneous>): string {
    //use stringifyErroneus which already handles a single Erroneous object
    return Array.from(value).map(erroneous => {
        return stringifyErroneous(erroneous);
    }).join('\n');
}

/**
 * takes in a stringified version of a set of erroneous objects and reconstructs the original set.
 * This reverses the custom serialization done by _stringify.
 * @param value Stringified version of the set
 * @returns Reconstructed Set of objects
 */
export function _parse(value: string): Set<Erroneous> {
    const lines = value.split('\n');
    const result = new Set<Erroneous>();

    for (const line of lines) {
        if (line.trim()) {
            const item = parseErroneous(line);
            result.add(item);
        }
    }

    return result;
}