import request from 'supertest';
import express from 'express';
import guestsRouter from '../routes/foodbankManager';

const app = express();
app.use(express.json());
app.use('/', guestsRouter);

// Dynamically disable nock for real HTTP
async function disableNockIfNeeded() {
  try {
    const nock = await import('nock');
    if (typeof nock.restore === 'function') nock.restore();
    if (typeof nock.enableNetConnect === 'function') nock.enableNetConnect();
    console.log('Nock disabled for integration test');
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
      cf_guests_45ae5f86e4: "In Country",
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

    console.log("SENDING TO FBM:", JSON.stringify(newGuest, null, 2));

    const res = await request(app)
      .post('/guests/add')
      .send(newGuest);

    console.log("FBM API response:", res.body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.firstname).toBe("Sheldon");
    expect(res.body.lastname).toBe("Plankton");
  });
});