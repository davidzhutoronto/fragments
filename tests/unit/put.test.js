// tests/unit/put.test.js

const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // POST Using a valid username/password pair should give a success result
  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('PUT test string');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resPut = await request(app)
      .put(`/v1/fragments/${res.body.fragment.id}`)
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('PUT test string 2');
    expect(resPut.statusCode).toBe(200);
    expect(resPut.body.status).toBe('ok');

    const fragment = new Fragment({
      id: res.body.fragment.id,
      ownerId: res.body.fragment.ownerId,
      type: 'text/plain',
      size: 0,
    });
    const textString = await fragment.getData();
    expect(textString.toString()).toBe('PUT test string 2');
  });
});
