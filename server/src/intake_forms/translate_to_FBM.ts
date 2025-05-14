import assert from "assert";
import { Clients, headers } from "./custom_types";
import { FBMGuest, HouseholdMember } from "../../routes/helper";

export function convertClientsToFBM(clients: Clients): FBMGuest[] {
    const fbmGuests: FBMGuest[] = [];

    clients.forEach(clientMap => {
        //ensure first name, last name, dob, zipcode, city, number of people in household are present, 
        // baby services
        // and each person has a first name, last name, and age, 
        //assert(Array.from(clientMap.keys()).toString() === headers.toString(), 'Missing required fields');
        let number;
        clientMap.forEach((value, key) => {
            if (key === 'Head of Household Date of Birth' || key === 'Head of Household Zip code:' || key === 'Head of Household City:' || key === 'Head of Household First Name' || key === 'Head of Household Last Name' || key === 'Other than the Head of Household, how many people in their/your household?' || key === 'Do you have a baby and want extra services?' || key === 'Head of Household County:') {
                assert(value !== null && value !== '', `Missing required field: ${key}`);
            }
        });

        // check all fields that match up to

        // Determine the household size category based on the number of people
        let householdSizeCategory: | "Small- 1 to 3" | "Medium- 4 to 6" | "Large- 7 to 9" | "X-Large, 10 or more" | "Emergency Box" | "No-Cook Bag" | "Com-Coll Box" | "Elem School Box";
        const number_of_people: number = parseInt(clientMap.get('Other than the Head of Household, how many people in their/your household?')!) + 1;

        if (number_of_people >= 1 && number_of_people <= 3) {
            householdSizeCategory = "Small- 1 to 3";
        } else if (number_of_people >= 4 && number_of_people <= 6) {
            householdSizeCategory = "Medium- 4 to 6";
        } else if (number_of_people >= 7 && number_of_people <= 9) {
            householdSizeCategory = "Large- 7 to 9";
        } else if (number_of_people >= 10) {
            householdSizeCategory = "X-Large, 10 or more";
        } else {
            throw new Error("Invalid number of people in household");
        }


        const fbmGuest: FBMGuest = {
            firstname: clientMap.get('Head of Household First Name')!,
            lastname: clientMap.get('Head of Household Last Name')!,
            dob: clientMap.get('Head of Household Date of Birth')!,
            city: clientMap.get('Head of Household City:')!,
            zipcode: clientMap.get('Head of Household Zip code:')!,
            street_address: clientMap.get('Head of Household Street:')!,
            apartment: clientMap.get('Head of Household APT # (if Applicable):') || undefined,
            state: 'WA', //TODO: washington
            //TODO: account for the 10+
            household_total: (parseInt(clientMap.get('Other than the Head of Household, how many people in their/your household?')!) + 1),
            county: clientMap.get('Head of Household County:')!, // Placeholder, needs to be generated based on zipcode
            cf_guests_45ae5f86e4: clientMap.get('Head of Household City:') === 'Lynnwood' ? 'In City' : 'Out of City', //TODO: need to do better checking
            cf_guests_e8827ca4cf: clientMap.get('Do you have a baby and want extra services?') === 'Yes' ? '1' : '0',
            cf_guests_459373e1d1: clientMap.get('Do you or members of your family not eat...')?.split(', ') || undefined, //TODO: add other fields as questions
            cf_guests_1fb4745f10: "Provided",
            cf_guests_8e6f172090: householdSizeCategory,
        };

        //extract the sets of first names, last names, and ages of all clients tied to the household


        //
        // Add household members
        const othersHousehold: HouseholdMember[] = [];
        for (let i = 1; i <= 10; i++) {
            const firstName = clientMap.get(`${i}st member's first name`) || clientMap.get(`${i}nd member's first name`) || clientMap.get(`${i}rd member's first name`) || clientMap.get(`${i}th member's first name`);
            const lastName = clientMap.get(`${i}st member's last name`) || clientMap.get(`${i}nd member's last name`) || clientMap.get(`${i}rd member's last name`) || clientMap.get(`${i}th member's last name`);
            const age = clientMap.get(`${i}st member's age`) || clientMap.get(`${i}nd member's age`) || clientMap.get(`${i}rd member's age`) || clientMap.get(`${i}th member's age`);

            if (firstName && lastName && age) {
                othersHousehold.push({
                    name: firstName + ' ' + lastName,
                    age: convertAgeToDate(parseInt(age)),
                });
            }
        }
        fbmGuest.othersHousehold = othersHousehold;

        fbmGuests.push(fbmGuest);
    });

    return fbmGuests;
}
/*
* converts the age of the person to a date (yyyy-mm-dd) which goes on the database
*/
export function convertAgeToDate(age: number): string {
    const today: Date = new Date();
    const birthYear: number = today.getFullYear() - age;
    const birthDate: Date = new Date(birthYear, today.getMonth(), today.getDate());

    const year: number = birthDate.getFullYear();
    const month: string = String(birthDate.getMonth() + 1).padStart(2, '0');
    const day: string = String(birthDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}