import request from 'supertest';
import express from 'express';
import guestsRouter from '../routes/foodbankManager';
import { FBMGuest, HouseholdMember } from "../routes/helper";
import { Clients } from '../src/intake_forms/custom_types';
import { getClients } from '../src/intake_forms/client_intake';
import { convertClientsToFBM } from '../src/intake_forms/translate_to_FBM';

const app = express();
app.use(express.json());
app.use('/', guestsRouter);

// Dynamically disable nock for real HTTP
async function disableNockIfNeeded() {
  try {
    const nock = await import('nock');
    if (typeof nock.restore === 'function') nock.restore();
    if (typeof nock.enableNetConnect === 'function') nock.enableNetConnect();
    //console.log('Nock disabled for integration test');
  } catch (err) {
    console.warn('Could not disable nock:', err);
  }
}

const runTest = process.env.CI !== 'true'; // Only run if NOT in CI

describe('Real FBM Integration Test', () => {
  beforeAll(async () => {
    if (runTest) await disableNockIfNeeded();
  });

  const testFn = runTest ? test : test.skip;

  testFn('adds a real guest to FoodBank Manager', async () => {
    const newGuest = {
      firstname: "Sheldon",
      lastname: "Plankton",
      dob: "1990-10-10",
      homeless: 0,
      gender: "0",
      race: "0",
      household_total: 1,
      language: "English",
      cf_guests_45ae5f86e4: "In City",
      cf_guests_8e6f172090: "Small- 1 to 3",
      cf_guests_e8827ca4cf: "0",
      cf_guests_459373e1d1: [],
      street_address: "Chum Bucket HQ",
      apartment: "",
      city: "Bikini Bottom",
      state: "Undersea",
      zipcode: "31415",
      county: "Pacific",
      phone: "",
      incomeTotal: "0.00",
      expenseTotal: "0.00",
      netTotal: "0.00"
    };

    //console.log("SENDING TO FBM:", JSON.stringify(newGuest, null, 2));

    const res = await request(app)
      .post('/guests/add')
      .send(newGuest);

    //console.log("FBM API response:", res.body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.firstname).toBe("Sheldon");
    expect(res.body.lastname).toBe("Plankton");
  });
});

describe('Real FBMGuest Integration Test', () => {
  beforeAll(async () => {
    if (runTest) await disableNockIfNeeded();
  });

  const testFn = runTest ? test : test.skip;

  testFn('adds a real FBMGuest to FoodBank Manager', async () => {
    const newGuest: FBMGuest = {
      firstname: "FBMGuest",
      lastname: "PleaseWork",
      dob: "1990-10-10",
      homeless: 0,
      gender: "0",
      race: "0",
      household_total: 1,
      language: "English",
      cf_guests_45ae5f86e4: "In City",
      cf_guests_8e6f172090: "Small- 1 to 3",
      cf_guests_e8827ca4cf: "0",
      cf_guests_459373e1d1: [],
      street_address: "Chum Bucket HQ",
      apartment: "",
      city: "Bikini Bottom",
      state: "Undersea",
      zipcode: "31415",
      county: "Pacific",
      phone: "",
      incomeTotal: "0.00",
      expenseTotal: "0.00",
      netTotal: "0.00",
      cf_guests_1fb4745f10: ["Provided"],
    };

    //console.log("SENDING TO FBM:", JSON.stringify(newGuest, null, 2));

    const res = await request(app)
      .post('/guests/add')
      .send(newGuest);

    //console.log("FBM API response:", res.body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.firstname).toBe("FBMGuest");
    expect(res.body.lastname).toBe("PleaseWork");
  });
});

describe('Real FBMGuest Integration Test', () => {
  beforeAll(async () => {
    if (runTest) await disableNockIfNeeded();
  });

  const testFn = runTest ? test : test.skip;

  testFn('From the spread sheet, adds a real FBMGuest to FoodBank Manager', async () => {
    const clients: Clients = await getClients();
    const result: FBMGuest[] = convertClientsToFBM(clients);
    //test to make sure convertClientsToFBM is not empty
    //console.log("RESULT:", result);
    expect(result.length).toBeGreaterThan(0);

    //console.log("SENDING TO FBM:", JSON.stringify(newGuest, null, 2));
    result.forEach(async (guest, index) => {
      const res = await request(app)
        .post('/guests/add')
        .send(guest);

      //console.log("FBM API response:", res.body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.firstname).toBe(guest.firstname);
      expect(res.body.lastname).toBe(guest.lastname);
    });
  });
});