import request from 'supertest';
import express from 'express';
import guestsRouter from '../routes/foodbankManager';
import nock from 'nock';

const app = express();
app.use(express.json());
app.use('/', guestsRouter);

describe('Real FBM Integration Test', () => {
  beforeAll(() => {
    // Disable nock interceptors and allow real HTTP connections for CI integration test
    if (nock.isActive()) {
      nock.restore(); // reset any overrides
    }
    nock.enableNetConnect(); // allow external requests
  });

  it('adds a real guest to FoodBank Manager', async () => {
    const newGuest = {
      firstname: "Sheldon",                     // string; required; non-empty
      lastname: "Plankton",                     // string; required; non-empty
      dob: "1990-10-10",                        // string; required; format: YYYY-MM-DD
      homeless: 0,                              // number; required; 0 = has residence, 1 = homeless
      gender: "0",                              // string; required; "0" = Male, "1" = Female, etc.
      race: "0",                                // string; required; must match dropdown values
      household_total: 1,                       // number; required; must be ≥ 1
      language: "English",                      // string; required; must be a valid language option
      cf_guests_45ae5f86e4: "In Country",       // string; required; exact match to dropdown (eligible service)
      cf_guests_8e6f172090: "Small- 1 to 3",    // string; required; exact match to dropdown (service size)
      cf_guests_e8827ca4cf: "0",                // string; optional; "0" = no baby service, "1" = yes
      cf_guests_459373e1d1: [],                 // array; optional; e.g., ["No Pork", "No Dairy"]
      street_address: "Chum Bucket HQ",         // string; required if homeless = 0
      apartment: "",                            // string; optional
      city: "Bikini Bottom",                    // string; optional
      state: "Undersea",                        // string; optional
      zipcode: "31415",                         // string; optional
      county: "Pacific",                        // string; optional
      phone: "",                                // string; optional
      incomeTotal: "0.00",                      // string; optional; must be a stringified float
      expenseTotal: "0.00",                     // string; optional; must be a stringified float
      netTotal: "0.00"                          // string; optional; must be a stringified float
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