// testing file for our temp FoodBank Manager API calls

import request from 'supertest';
import express from 'express';
import nock from 'nock';
import guestsRouter from '../routes/foodbankManager';
import { buildFullGuestPayload } from '../routes/helper';

const app = express();
app.use('/', guestsRouter);

describe('st', () => {
  it('returns a list of guests from the API', async () => {
    // Mock the token response
    nock('https://fbc403.soxbox.co')
      .post('/rest-api/token')
      .reply(200, { token: 'mocked-token' });

    // Mock the guest data
    nock('https://fbc403.soxbox.co', {
      reqheaders: {
        authorization: 'Bearer mocked-token'
      }
    })
      .get('/rest-api/clients')
      .reply(200, [{ id: 1, name: 'Test Guest' }]);

    const res = await request(app).get('/guests');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Test Guest' }]);
  });
});

app.use('/guests', guestsRouter);

// Test for adding a new guest to FBM database
describe('POST /guests/add', () => {
  it('adds a new guest to FBM', async () => {
    // Mock token request
    nock('https://fbc403.soxbox.co')
      .post('/rest-api/token')
      .reply(200, { token: 'mocked-token' });

    // Mock FBM guest creation
    nock('https://fbc403.soxbox.co', {
      reqheaders: {
        authorization: 'Bearer mocked-token',
        'content-type': 'application/json',
      }
    })
      .post('/rest-api/clients')
      .reply(201, { id: 2, firstname: 'Orange', lastname: 'Mange' });

    const res = await request(app)
      .post('/guests/add')
      .send({
        firstname: "Orange",
        lastname: "Mange",
        dob: "2025-05-10",
        city: "Lynnwood",
        state: "WA",
        zipcode: "123",
        language: "English",
        gender: "0",
        race: "0",
        household_total: 3,
        othersHousehold: [
          { name: "Pineapple", age: "2025-05-11" },
          { name: "Grape", age: "2025-05-12" }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, firstname: 'Orange', lastname: 'Mange' });
  });
});

describe('POST /guest/search', () => {
  it('returns guests that match firstname, lastname, street_address, or phone (including othersHousehold)', async () => {
    // Mock token fetch
    nock('https://fbc403.soxbox.co')
      .post('/rest-api/token')
      .reply(200, { token: 'mocked-token' });

    const mockGuests = {
      items: [
        {
          id: 1,
          firstname: "Alice",
          lastname: "Smith",
          street_address: "123 Main St",
          phone: "555-1234",
          othersHousehold: [
            { name: "Charlie" },
            { name: "Daisy" }
          ]
        },
        {
          id: 2,
          firstname: "Bob",
          lastname: "Jones",
          street_address: "456 Oak Ave",
          phone: "555-5678",
          othersHousehold: []
        },
        {
          id: 3,
          firstname: "Carol",
          lastname: "Brown",
          street_address: "789 Pine Rd",
          phone: "555-0000",
          othersHousehold: [
            { name: "alice" }
          ]
        }
      ],
      meta: { total: 3 }
    };

    // Mock guest fetch
    nock('https://fbc403.soxbox.co')
      .get('/rest-api/clients')
      .query(true) // ignore query params
      .reply(200, mockGuests);

    const res = await request(app)
      .get('/guest/search')
      .send({ firstname: "alice" });

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBe(2);
    const resultIDs = res.body.results.map((g: any) => g.id);
    expect(resultIDs).toContain(1); // direct firstname match
    expect(resultIDs).toContain(3); // member name match
  });
});