export function buildFullGuestPayload(overrides = {}) {
  return {
    firstname: "",
    middlename: "",
    lastname: "",
    dob: "2000-01-01",
    homeless: 0,
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    zipcode: "",
    visit_exception: 0,
    visitor_type: null,
    notes: null,
    dobSet: 1,
    lng: null,
    lat: null,
    noMatch: 0,
    addrUpdated: 0,
    blackball: 0,
    profilePicture: "",
    saveCount: 0,
    household_total: 1,
    othersHousehold: [],
    barcode: "",
    county: "",
    phone: "",
    language: "English",
    gender: "0",
    race: "0",
    incomeTotal: "0.00",
    expenseTotal: "0.00",
    netTotal: "0.00",
    custom1Field: "",
    cf_guests_901d83d3c7: "",
    cf_guests_1fb4745f10: [],
    cf_guests_b70a510d7c: "",
    cf_guests_7d69b8c4d5: [],
    cf_guests_9d6e374e65: "",
    cf_guests_36ccf4ecb9: "",
    cf_guests_ed8edf4e3d: "",
    cf_guests_e22b8fce8e: null,
    cf_guests_24d312b3b6: "",
    cf_guests_45ae5f86e4: "In Country",
    cf_guests_8e6f172090: "Small- 1 to 3",
    cf_guests_e8827ca4cf: null,
    cf_guests_459373e1d1: [],
    ...overrides,
  };
}

export interface HouseholdMember {
  id?: string;
  name: string;
  age: string; // yyyy-mm-dd format
  rel?: string;
  note?: string;
  race?: string;
  gender?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FBMGuest {
  firstname: string;
  middlename?: string;
  lastname: string;
  dob: string; // yyyy-mm-dd
  homeless?: 0 | 1;
  street_address?: string;
  apartment?: string;
  city: string;
  state: string;
  zipcode: string;
  // NOT USED BY US:
  visit_exception?: 0 | 1;
  visitor_type?: string;
  notes?: string;
  dobSet?: 0 | 1;
  lng?: number;
  lat?: number;
  noMatch?: 0 | 1;
  addrUpdated?: 0 | 1;
  blackball?: 0 | 1;
  profilePicture?: string;
  saveCount?: number;
  // USED BY US:
  household_total: number;
  othersHousehold?: HouseholdMember[];
  barcode?: string;
  county: string;//TODO: need to generate based on zipcode
  phone?: string;
  language?: string;
  gender?: string; // usually stringified enum like "0", "1", etc.
  race?: string;
  // NOT USED BY US:
  incomeTotal?: string; // as string: "0.00"
  expenseTotal?: string;
  netTotal?: string;

  // Custom fields
  custom1Field?: string; // "Ethnic Food Added" checkbox, can leave blank
  cf_guests_901d83d3c7?: "African Foods" | "Middle Eastern Foods" | "Latin American / Hispanic Foods" | "Asian Foods";
  cf_guests_1fb4745f10: ["Provided"]; // Should always include ["Provided"]
  // NOT USED BY US:
  cf_guests_b70a510d7c?: string;
  cf_guests_7d69b8c4d5?: string[];
  cf_guests_9d6e374e65?: string;
  cf_guests_36ccf4ecb9?: string;
  cf_guests_ed8edf4e3d?: string;
  cf_guests_e22b8fce8e?: "0" | "1";
  cf_guests_24d312b3b6?: string;
  // USED BY US:
  cf_guests_45ae5f86e4: "In City" | "Out of City" | "Out of County";
  cf_guests_8e6f172090:
  | "Small- 1 to 3"
  | "Medium- 4 to 6"
  | "Large- 7 to 9"
  | "X-Large, 10 or more"
  | "Emergency Box"
  | "No-Cook Bag"
  | "Com-Coll Box"
  | "Elem School Box";
  cf_guests_e8827ca4cf: "0" | "1"; // Baby service
  cf_guests_459373e1d1?: string[]; // e.g., ["No Pork", "No Beef", "No Meat", "No Fish/Seafood",
  // "Halal Only", "No Dairy", "No Regular Milk", "Add Alternative Milk", "No Canned Food",
  // "No Bread", "No Deserts", "Gluten Free Food ONLY", "Add Gluten Free", "Add Sugar Free",
  // "Add Low Sodium Foods", "Peanut Allergy", "Diaper Wipes", "Diaper size 1", "Diaper size 2",
  // "Diaper size 3", "Diaper size 4", "Diaper size 5", "Diaper size 6", "Pull-ups",
  // "Adult Diapers M/L", "Baby Food", "Baby Formula", "Dog Food", "Cat Food"]
}