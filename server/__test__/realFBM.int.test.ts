import request from 'supertest';
import express from 'express';
import guestsRouter from '../routes/foodbankManager';

const app = express();
app.use(express.json());
app.use('/', guestsRouter);

describe('Real FBM Integration Test', () => {
  it('adds a real guest to FoodBank Manager', async () => {
    const newGuest = {
      firstname: "Sheldon",                     // string; required
      lastname: "Plankton",                     // string; required
      dob: "1990-10-10",                        // string; required; format YYYY-MM-DD
      homeless: 0,                              // number; required; 0 = has residence
      gender: "0",                              // string; required
      race: "0",                                // string; required
      household_total: 1,                       // number; required
      language: "English",                      // string; required
      cf_guests_45ae5f86e4: "In Country",       // required dropdown value
      cf_guests_8e6f172090: "Small- 1 to 3",    // required dropdown value
      cf_guests_e8827ca4cf: "0",                // string; optional
      cf_guests_459373e1d1: [],                 // array; optional
      street_address: "Chum Bucket HQ",         // string; required if homeless = 0
      apartment: "",                            // optional
      city: "Bikini Bottom",                    // optional
      state: "Undersea",                        // optional
      zipcode: "31415",                         // optional
      county: "Pacific",                        // optional
      phone: "",                                // optional
      incomeTotal: "0.00",                      // stringified number
      expenseTotal: "0.00",                     // stringified number
      netTotal: "0.00"                          // stringified number
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