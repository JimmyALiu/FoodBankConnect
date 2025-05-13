import request from 'supertest';
import express from 'express';
import guestsRouter from '../routes/foodbankManager';

const app = express();
app.use(express.json());
app.use('/', guestsRouter);

// Skip integration test in CI
const isCI = process.env.CI === 'true';

// Dynamically disable nock for real HTTP (only in local/dev)
async function disableNockIfNeeded() {
  try {
    const nock = await import('nock');

    if (typeof nock.restore === 'function') nock.restore(); // remove HTTP interceptors
    if (typeof nock.enableNetConnect === 'function') nock.enableNetConnect(); // allow HTTP

    console.log('Nock disabled — real HTTP enabled');
  } catch (err) {
    console.warn('Failed to disable nock:', err);
  }
}

// Skip tests entirely in CI to avoid network failures
if (isCI) {
  console.log('Skipping realFBM.int.test.ts in CI environment');
} else {
  describe('Real FBM Integration Test', () => {
    beforeAll(async () => {
      await disableNockIfNeeded();
    });

    it('adds a real guest to FoodBank Manager', async () => {
      const newGuest = {
        firstname: "Sheldon",                         // string; required
        lastname: "Plankton",                         // string; required
        dob: "1990-10-10",                            // string; format YYYY-MM-DD
        homeless: 0,                                  // number; 0 = not homeless
        gender: "0",                                  // string; dropdown
        race: "0",                                    // string; dropdown
        household_total: 1,                           // number; ≥ 1
        language: "English",                          // string; dropdown option
        cf_guests_45ae5f86e4: "In Country",           // string; eligible service
        cf_guests_8e6f172090: "Small- 1 to 3",        // string; service size
        cf_guests_e8827ca4cf: "0",                    // string; baby service flag
        cf_guests_459373e1d1: [],                     // array; cart modifications
        street_address: "Chum Bucket HQ",             // string
        apartment: "",                                // string
        city: "Bikini Bottom",                        // string
        state: "Undersea",                            // string
        zipcode: "31415",                             // string
        county: "Pacific",                            // string
        phone: "",                                    // string
        incomeTotal: "0.00",                          // stringified float
        expenseTotal: "0.00",                         // stringified float
        netTotal: "0.00"                              // stringified float
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
}