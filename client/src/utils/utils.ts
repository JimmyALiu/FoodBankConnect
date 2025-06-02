// utility file that contains helper functions for the client
import type { FBMGuest } from "../../../server/routes/helper.ts";

export function demo_sum(a: number, b: number) {
    return a + b
}

interface table_entry {
    id: number,
    firstname: string,
    lastname: number,
    phone: string,
    street_address: string,
    othersHousehold: string
}

interface response_data {
    results: table_entry[],
}

export function parseSearchResponseData(response: response_data) {
    let len: number = response.results.length;

    let newClients: any = [];
    for (let i = 0; i < len; i++) {
        newClients = [
            ...newClients,
            {
                id: response.results[i].id,
                firstname: response.results[i].firstname,
                lastname: response.results[i].lastname,
                street_address: response.results[i].street_address,
                phone: response.results[i].phone,
                othersHousehold: response.results[i].othersHousehold
            }
        ]
    }

    return newClients;
}

// Helper function to find duplicates in the clients data
export function findDuplicates(guests: FBMGuest[]): FBMGuest[] {
  const duplicates: FBMGuest[] = [];
  const seen = new Set<string>();

  guests.forEach((guest) => {
    const identifier = `${guest.firstname} ${guest.lastname} ${guest.street_address} ${guest.city} ${guest.state}`;
    if (seen.has(identifier)) {
      duplicates.push({
        ...guest,
        notes: guest.notes ? `${guest.notes} | Duplicate Entry` : "Duplicate Entry", 
      });
    } else {
      seen.add(identifier);
    }
  });

  return duplicates;
}

// Helper function to validate guest data
export function isValidGuest(guest: FBMGuest): boolean {
  if (typeof guest.firstname !== "string" || guest.firstname.trim() === "") {
    console.error("Invalid firstname:", guest.firstname);
    return false;
  }
  if (typeof guest.lastname !== "string" || guest.lastname.trim() === "") {
    console.error("Invalid lastname:", guest.lastname);
    return false;
  }
  if (typeof guest.street_address !== "string" || guest.street_address.trim() === "") {
    console.error("Invalid street_address:", guest.street_address);
    return false;
  }
  if (typeof guest.city !== "string" || guest.city.trim() === "") {
    console.error("Invalid city:", guest.city);
    return false;
  }
  if (typeof guest.state !== "string" || guest.state.trim() === "") {
    console.error("Invalid state:", guest.state);
    return false;
  }
  return true;
}

