const request = require('supertest');

const app = require('../../src/app');

describe('USE /v1/fragments', () => {
  test('404 error handler', async () => {
    const res = await request(app).get('/v1/fragmentserror').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
