import fs from 'fs';
import path from 'path';
import { Erroneous } from './intake_forms/custom_types';
import { internalFormGuests } from '../inMemoryStorage/cache';

const BACKUP_FILE: string = path.join(__dirname, '../inMemoryStorage/backup.json');

// Initial in-memory data


/**
 * loads the backup file, will throw an error if the file is not valid JSON, not valid Erroneous or does not exist.
 * This function clears the existing internalFormGuests Set and populates it with the data from the backup file.
 * If the backup file does not exist, it will log a message and empty the set
 */
export function loadBackup() {
    if (fs.existsSync(BACKUP_FILE)) {
        try {
            const raw: Buffer = fs.readFileSync(BACKUP_FILE);
            const parsed: Erroneous[] = JSON.parse(raw.toString());
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
export function saveBackup() {
    try {
        fs.writeFileSync(BACKUP_FILE, JSON.stringify([...internalFormGuests]), 'utf-8');
        console.log("Backup saved.");
    } catch (err) {
        console.error("Failed to save backup:", err);
    }
}
