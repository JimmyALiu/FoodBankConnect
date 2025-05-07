// testing file for our temp FoodBank Manager API calls

import request from 'supertest';
import express from 'express';
import nock from 'nock';
import guestsRouter from '../routes/foodbankManager';

const app = express();
app.use('/', guestsRouter);

describe('GET /guests', () => {
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