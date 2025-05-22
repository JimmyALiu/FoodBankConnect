// This file is for API calls to and from the FoodBank Manager database. It is currently
// set up to communicate with our tester database by fetching the one guest stored.
// visit http://localhost:3000/api/fbm/guests to see it is working
// node --loader ts-node/esm index.ts
// EXAMPLE FIELDS:
// {"id":2,"system_id":null,"snap_id":2,"public_user_id":null,"firstname":"Orange","middlename":"","lastname":"Mange","dob":"2025-05-10","homeless":0,"street_address":"","apartment":"","city":"Lynnwood","state":"WA","zipcode":"123","visit_exception":0,"visitor_type":null,"notes":null,"dobSet":1,"lng":null,"lat":null,"noMatch":0,"addrUpdated":0,"blackball":0,"profilePicture":"","saveCount":0,"household_total":3,"othersHousehold":[{"id":"e5d62f76-8a8a-462f-9d37-c6d8de07a12a","name":"Pineapple","age":"2025-05-11","rel":"","note":"","race":"","gender":"","created_at":"2025-05-11 22:24:09","updated_at":"2025-05-11 22:24:09"},{"id":"d280ed1b-e967-43c8-ba0e-9141b013221b","name":"Grape","age":"2025-05-12","rel":"","note":"","race":"","gender":"","created_at":"2025-05-11 22:24:09","updated_at":"2025-05-11 22:24:09"}],"updated_at":"2025-05-11 22:24:09","created_at":"2025-05-11 22:24:09","barcode":"","county":"","phone":"","language":"English","gender":"0","race":"0","incomeTotal":"0.00","expenseTotal":"0.00","netTotal":"0.00","custom1Field":"","cf_guests_901d83d3c7":"","cf_guests_1fb4745f10":[],"cf_guests_b70a510d7c":"","cf_guests_7d69b8c4d5":[],"cf_guests_9d6e374e65":"","cf_guests_36ccf4ecb9":"","cf_guests_ed8edf4e3d":"","cf_guests_e22b8fce8e":null,"cf_guests_24d312b3b6":"","cf_guests_45ae5f86e4":"In Country","cf_guests_8e6f172090":"Small- 1 to 3","cf_guests_e8827ca4cf":null,"cf_guests_459373e1d1":[]}

import express from 'express';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

console.log('API_BASE:', process.env.API_BASE);
const API_BASE = process.env.API_BASE!;
const API_USERNAME = process.env.API_USERNAME!;
const API_PASSWORD = process.env.API_PASSWORD!;
const LOCATION_ID = Number(process.env.LOCATION_ID);

interface HouseholdMember {
  name?: string;
  [key: string]: any; // for any extra fields you don't care about
}

interface Guest {
  id: number;
  firstname?: string;
  lastname?: string;
  street_address?: string;
  phone?: string;
  othersHousehold?: HouseholdMember[];
  [key: string]: any; // allow extra fields to avoid breaking
}

// Helper to get a token
async function getToken() {
  const res = await axios.post(`${API_BASE}/rest-api/token`, {
    username: API_USERNAME,
    password: API_PASSWORD,
    location: LOCATION_ID
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  return res.data.token;
}

// Example route to get all guests
router.get('/guests', async (req, res) => {
  try {
    const token = await getToken();
    console.log('Token:', token);

    const guestsRes = await axios.get(`${API_BASE}/rest-api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(guestsRes.data);
  } catch (err) {
    const error = err as AxiosError;

    console.error('ERROR during /guests request:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }

    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

// // Route to search for a guest, including non-head of household
// router.get('/guests/search', async (req, res) => {
//   try {
//     const token = await getToken();

//     // Build the filters object from query parameters
//     const filters: Record<string, string> = {};
//     for (const [key, value] of Object.entries(req.query)) {
//       filters[`filters[${key}]`] = value as string;
//     }

//     // Add a filter to search across all individuals, not just head of household
//     if (req.query.name) {
//       filters['filters[allIndividuals]'] = 'true'; // Custom filter to include all individuals
//       filters['filters[name]'] = req.query.name as string; // Search by name
//     }
    
//     const guestsRes = await axios.get(`${API_BASE}/rest-api/clients`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       params: filters
//     });

//     res.json(guestsRes.data);
//   } catch (err) {
//     const error = err as AxiosError;
//     console.error('Search error:', error.message);
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Data:', error.response.data);
//     }
//     res.status(500).json({ error: 'Failed to search guest records' });
//   }
// });

// Route to add a new guest to FBM database
router.post('/guests/add', async (req, res) => {
  try {
    const token = await getToken();

    // The new guest data should be sent in the request body
    const guestData = req.body;

    const addGuestRes = await axios.post(`${API_BASE}/rest-api/clients`, guestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(201).json(addGuestRes.data); // Respond with the created guest data
  } catch (err) {
    const error = err as AxiosError;
    console.error('Search error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to add client' });
  }
});

// Route to search for a guest by firstname, lastname, street_address, and/or phone fields
router.get('/guest/search', async (req, res) => {
  try {
    const token = await getToken();

    const { firstname, lastname, street_address, phone } = req.query;

    // Fetch all guests (may want to filter on backend if address or phone is included)
    const guestsRes = await axios.get(`${API_BASE}/rest-api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const guests: Guest[] = guestsRes.data.items;

    // Normalize query
    const fName = firstname?.toString().toLowerCase() || '';
    const lName = lastname?.toString().toLowerCase() || '';
    const addr = street_address?.toString().toLowerCase() || '';
    const ph = phone?.toString().toLowerCase() || '';

    // Filter guests
    const matches = guests.filter((guest) => {
      const guestFirst = (guest.firstname || '').toLowerCase();
      const guestLast = (guest.lastname || '').toLowerCase();
      const guestAddr = (guest.street_address || '').toLowerCase();
      const guestPhone = (guest.phone || '').toLowerCase();

      const nameMatch = 
        (fName && guestFirst.includes(fName)) || 
        (lName && guestLast.includes(lName));

      const addrMatch = addr && guestAddr.includes(addr);
      const phoneMatch = ph && guestPhone.includes(ph);

      const othersMatch = (guest.othersHousehold || []).some((member: HouseholdMember) => {
        const name = (member.name || '').toLowerCase();
        return (
          (fName && name.includes(fName)) || 
          (lName && name.includes(lName))
        );
      });

      // Return true if any criteria matches
      return (
        (!fName || guestFirst.includes(fName) || othersMatch) &&
        (!lName || guestLast.includes(lName) || othersMatch) &&
        (!addr || addrMatch) &&
        (!ph || phoneMatch)
      );
    });

    res.json({ results: matches });
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;