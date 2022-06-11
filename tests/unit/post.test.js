// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users can create a plain text fragment', async () => {
    const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 });
    await fragment.save();
    await fragment.setData(Buffer.from('a'));
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ dage: 'Link' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
