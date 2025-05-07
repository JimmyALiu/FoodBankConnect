// This file is for API calls to and from the FoodBank Manager database. It is currently
// set up to communicate with our tester database by fetching the one guest stored.
// visit http://localhost:3000/api/fbm/guests to see it is working

import express from 'express';
import axios, { AxiosError } from 'axios';

const router = express.Router();

// Real plain text domain and credentials, need to replace with user input during login!!!
const API_BASE = 'https://fbc403.soxbox.co';
const API_USERNAME = 'cse403';
const API_PASSWORD = 'connect403';
const LOCATION_ID = 1;

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

export default router;