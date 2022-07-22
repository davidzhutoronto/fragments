// tests/unit/get-one-info.test.js

const request = require('supertest');

const app = require('../../src/app');
//const { Fragment } = require('../../src/model/fragment');
describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:id/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users can get info', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = request(app)
      .get(`/v1/fragments/${res.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');
    expect((await resGet).statusCode).toBe(200);
  });

  test('error if id not exist', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = request(app).get(`/v1/fragments/abc/info`).auth('user1@email.com', 'password1');
    expect((await resGet).statusCode).toBe(404);
  });
});
