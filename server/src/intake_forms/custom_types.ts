import { FBMGuest } from "../../routes/helper";
export type Clients = Set<Map<string, string | null>>;
export type Client = Map<string, string | null>;

export type FlagRecord = {
    client: Client;
    description: string;
    timestamp: Date;
};

export const headers: Set<string> = new Set([
    "Timestamp",
    "Head of Household First Name",
    "Head of Household Last Name",
    "Head of Household Date of Birth",
    "Head of Household House Number:",
    "Head of Household Street:",
    "Head of Household APT # (if Applicable):",
    "Head of Household City:",
    "Head of Household Zip code:",
    "Head of Household County:",
    "Other than the Head of Household, how many people in their/your household?",
    "In terms of meat, does your family eat...",
    "Does your family have a preference for any of the following types of cultural or ethnic foods? ",
    "Pick up food modification:",
    "Allergies: please denote foods that should not appear in your ready to pick up bags",
    "I have a life threatening Allergy and need individualized assistance to avoid cross contamination. (will follow up in person)",
    "Any other dietary/ food choice information you would like us to add to your file (add notes about allergens not listed here)",
    "Do you have a baby and want extra services?",
    "Do you need adult diapers?",
    "What size diapers does your baby(s) need?",
    "Do You Need Baby Food?",
    "Do You Need Baby Formula?",
    "If yes, what type?",
    "Do you need dog food?",
    "Do you need cat food?",
    "I acknowledge",
    "1st member's first name",
    "1st member's last name",
    "1st member's age",
    "2nd member's first name",
    "2nd member's last name",
    "2nd member's age",
    "3rd member's first name",
    "3rd member's last name",
    "3rd member's age",
    "4th member's first name",
    "4th member's last name",
    "4th member's age",
    "5th member's first name",
    "5th member's last name",
    "5th member's age",
    "6th member's first name",
    "6th member's last name",
    "6th member's age",
    "7th member's first name",
    "7th member's last name",
    "7th member's age",
    "8th member's first name",
    "8th member's last name",
    "8th member's age",
    "9th member's first name",
    "9th member's last name",
    "9th member's age",
    "10th member's first name",
    "10th member's last name",
    "10th member's age",
    "Yes, I have over 10 individuals in my household"
]);


export const requiredFields = [
    'Timestamp',
    'Head of Household County:',
    'Head of Household First Name',
    'Head of Household Last Name',
    'Head of Household Date of Birth',
    'Head of Household City:',
    'Head of Household Zip code:',
    'Other than the Head of Household, how many people in their/your household?'
];

/**
 * @fields_invalid is a set of field names that are invalid, basically means the form messed up
 * @FBMGuest will have '\0' for keys which are required but not present
 * @fields_erroneous_n_description is a map of field name to description of the error, 
 *     could be empty or more than one this may have unrequired fields, 
 *     but only fields that have data. Perhaps have volunteers decide to discard invalid fields
 *     note: description is for developer, will be subject to change
 */
export type Erroneous = {
    FBMGuest: FBMGuest;
    fields_invalid: Set<string>;
    fields_erroneous_n_description: Map<string, string>;
};