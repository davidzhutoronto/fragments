// tests/unit/get-one.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/:id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/:id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users can get data', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(200);
  });

  test('markdown can be converted to html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1')
      .send('#a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(200);
  });

  test('plain text cannot be converted to html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(415);
  });

  test('application/json can be converted to txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'application/json')
      .auth('user1@email.com', 'password1')
      .send({ name: 'David' });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(200);
  });

  test('markdown can be converted to itself (.md)', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/markdown')
      .auth('user1@email.com', 'password1')
      .send('#a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(200);
  });

  test('others(i.e. text) cannot be converted to markdown', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.md`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(415);
  });

  test('json can convert to itself json', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'application/json')
      .auth('user1@email.com', 'password1')
      .send({ name: 'David' });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.json`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(200);
  });

  test('Does not support unknown extension code: 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app)
      .get(`/v1/fragments/${res.body.fragment.id}.unknown`)
      .auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(415);
  });

  test('error if id not exist', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resGet = await request(app).get(`/v1/fragments/abc`).auth('user1@email.com', 'password1');
    expect(resGet.statusCode).toBe(200);
  });
});
