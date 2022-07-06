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

  // Using a valid username/password pair should give a success result with a fragments array
  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('This is a text');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test('responses error if type is not supported', async () => {
    const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 0 });
    await fragment.save();
    await fragment.setData(Buffer.from('a'));

    const res = await request(app)
      .post('/v1/fragments', fragment)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'notsupport')
      .send(fragment.data);

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
  });

  test('authenticated users post a fragments, data saved and read match each other', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('POST test string');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const fragment = new Fragment({
      id: res.body.fragments.id,
      ownerId: res.body.fragments.ownerId,
      type: 'text/plain',
      size: 0,
    });
    const textString = await fragment.getData();

    expect(textString.toString()).toBe('POST test string');
  });
  // TODO: we'll need to add tests to check the contents of the fragments array later
});
