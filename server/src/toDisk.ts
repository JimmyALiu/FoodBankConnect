import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Erroneous, parseErroneous, stringifyErroneous } from './intake_forms/custom_types';
import { internalFormGuests } from '../inMemoryStorage/cache';

const __dirname = path.normalize(path.dirname(new URL(import.meta.url).pathname).replace(/^\/[A-Za-z]:/, ''));
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
            const { key, iv, authTag } = loadKeyFromEnv() || {};
            if (!key || !iv || !authTag) {
                throw new Error("Encryption key, IV, or auth tag not found in environment.");
            }
            const decryptedData: string = decryptData(key, iv, raw.toString('utf-8'), authTag);
            //will check to see if the decrypted data is valid JSON
            const parsed: Set<Erroneous> = _parse(decryptedData);
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
 * saves and writes a new key for backup every time the server starts.
 */
export function saveBackup(backupFile: string = BACKUP_FILE) {
    try {
        const confidential_data: string = _stringify(internalFormGuests);
        const { key, iv, encrypted, authTag } = createKeyAndIV(confidential_data); // Generate a new key and IV for encryption
        // save the key, iv and auth to .env
        saveKeyToEnv(key, iv, authTag);

        fs.writeFileSync(backupFile, encrypted, 'utf-8');

        console.log("Backup saved.");
    } catch (err: unknown) {
        console.error("Failed to save backup:", err);
    }
}

/**
 * save key to a hidden file, currently fairly naive and near each other in disk
 * might alter this to store in a database or a more secure location in the future
 * @param key 256-bit key used for encryption
 * @param iv 96-bit IV used for encryption
 * @param authTag Authentication tag for encryption
 */
export function saveKeyToEnv(key: Buffer, iv: Buffer, authTag: Buffer) {
    const envFilePath = path.join(__dirname, '../.key');
    const envContent = `BACKUP_KEY=${key.toString('hex')}\nBACKUP_IV=${iv.toString('hex')}\nBACKUP_AUTH_TAG=${authTag.toString('hex')}`;
    // Ensure the directory exists before writing the file
    const dirPath = path.resolve(path.dirname(envFilePath));
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
        } catch (err) {
            console.error(`Failed to create directory at ${dirPath}:`, err);
            throw new Error(`Directory creation failed: ${dirPath}`);
        }
    }
    fs.writeFileSync(envFilePath, envContent, 'utf-8');
}

/**
 * Loads the encryption key, IV, and auth tag from the hidden key file.
 * @returns An object containing the key, iv, and authTag, or undefined if the file is not found.
 */
export function loadKeyFromEnv(): { key: Buffer, iv: Buffer, authTag: Buffer } | undefined {
    const envFilePath = path.join(__dirname, '../.key');
    if (fs.existsSync(envFilePath)) {
        const envContent = fs.readFileSync(envFilePath, 'utf-8');
        const lines = envContent.split('\n');
        const key = Buffer.from(lines[0].split('=')[1], 'hex');
        const iv = Buffer.from(lines[1].split('=')[1], 'hex');
        const authTag = Buffer.from(lines[2].split('=')[1], 'hex');
        return { key, iv, authTag };
    }
    console.error("Key file not found.");
    return undefined;
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

/**
 * This function creates a key and IV for AES-256-GCM encryption.
 * therefore we can store the key in memory and it will be a new key every time the server starts. 
 * @param plaintext 
 * @returns key, iv, encrypted data, and authTag.
 */
export function createKeyAndIV(plaintext: string): { key: Buffer, iv: Buffer, encrypted: string, authTag: Buffer } {
    // Generate a random key and IV for AES-256-GCM encryption 
    const key: Buffer = crypto.randomBytes(32); // 256-bit key
    const iv: Buffer = crypto.randomBytes(12);  // 96-bit IV is recommended for GCM

    const cipher: crypto.CipherGCM = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted: string = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag: Buffer = cipher.getAuthTag(); // Save this too
    return { key, iv, encrypted, authTag };
}

/**
 * decrypts the data if a backup file is being restored
 * @param key 256-bit key used for decryption
 * @param iv 96-bit IV used for decryption
 * @param encrypted Encrypted data to decrypt
 * @param authTag Authentication tag for decryption
 * @returns Decrypted json file as a string
 */
export function decryptData(key: Buffer, iv: Buffer, encrypted: string, authTag: Buffer): string {
    const decipher: crypto.DecipherGCM = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted: string = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}