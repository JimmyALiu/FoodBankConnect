import request from 'supertest';
import express from 'express';
import guestsRouter from '../routes/foodbankManager';

const app = express();
app.use(express.json());
app.use('/', guestsRouter);

// Helper to disable nock in ESM context (needed for CI)
const disableNock = async () => {
  try {
    const nockModule = await import('nock');
    const nock = nockModule.default;
    nock.restore(); // allow real HTTP requests
    nock.enableNetConnect(); // ensure external requests go through
    console.log("✅ Nock disabled for integration test");
  } catch (err) {
    console.warn("⚠️ Could not disable nock:", err);
  }
};

describe('Real FBM Integration Test', () => {
  beforeAll(async () => {
    await disableNock(); // Disable nock before running real test
  });

  it('adds a real guest to FoodBank Manager', async () => {
    const newGuest = {
      firstname: "Sheldon",                     // string; required; non-empty
      lastname: "Plankton",                     // string; required; non-empty
      dob: "1990-10-10",                        // string; required; format: YYYY-MM-DD
      homeless: 0,                              // number; required; 0 = has residence, 1 = homeless
      gender: "0",                              // string; required; e.g., "0" = Male
      race: "0",                                // string; required; dropdown option as string
      household_total: 1,                       // number; required; ≥ 1
      language: "English",                      // string; required; must match dropdown option
      cf_guests_45ae5f86e4: "In Country",       // string; required; must match "Eligible Service" dropdown exactly
      cf_guests_8e6f172090: "Small- 1 to 3",    // string; required; must match "Service Size" dropdown exactly
      cf_guests_e8827ca4cf: "0",                // string; optional; "0" or "1" (baby service)
      cf_guests_459373e1d1: [],                 // array; optional; cart modifications like ["No Pork"]
      street_address: "Chum Bucket HQ",         // string; optional if homeless = 1; required otherwise
      apartment: "",                            // string; optional
      city: "Bikini Bottom",                    // string; optional
      state: "Undersea",                        // string; optional
      zipcode: "31415",                         // string; optional
      county: "Pacific",                        // string; optional
      phone: "",                                // string; optional
      incomeTotal: "0.00",                      // string; optional; must be stringified float
      expenseTotal: "0.00",                     // string; optional; must be stringified float
      netTotal: "0.00"                          // string; optional; must be stringified float
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