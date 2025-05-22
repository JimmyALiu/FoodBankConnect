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
    "1st Member's First Name",
    "1st Member's Last Name",
    "1st Member's Age",
    "2nd Member's First Name",
    "2nd Member's Last Name",
    "2nd Member's Age",
    "3rd Member's First Name",
    "3rd Member's Last Name",
    "3rd Member's Age",
    "4th Member's First Name",
    "4th Member's Last Name",
    "4th Member's Age",
    "5th Member's First Name",
    "5th Member's Last Name",
    "5th Member's Age",
    "6th Member's First Name",
    "6th Member's Last Name",
    "6th Member's Age",
    "7th Member's First Name",
    "7th Member's Last Name",
    "7th Member's Age",
    "8th Member's First Name",
    "8th Member's Last Name",
    "8th Member's Age",
    "9th Member's First Name",
    "9th Member's Last Name",
    "9th Member's Age",
    "10th Member's First Name",
    "10th Member's Last Name",
    "10th Member's Age",
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