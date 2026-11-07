import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();

describe('authentication flow', () => {
  it('registers, logs in, and reports the authenticated role', async () => {
    const agent = request.agent(app);

    const reg = await agent.post('/api/user/register').type('form')
      .send({ username: 'anna', email: 'anna@example.com', password: 'secret123' });
    expect(reg.status).toBe(200);

    const login = await agent.post('/api/user/login').type('form')
      .send({ email: 'anna@example.com', password: 'secret123' });
    expect(login.status).toBe(200);
    expect(login.text).toBe('adopter');

    const check = await agent.get('/api/user/checkAuth');
    expect(check.status).toBe(200);
    expect(check.body).toEqual({ authenticated: true, role: 'adopter' });
  });

  it('rejects a login with the wrong password', async () => {
    await request(app).post('/api/user/register').type('form')
      .send({ username: 'bob', email: 'bob@example.com', password: 'secret123' });

    const res = await request(app).post('/api/user/login').type('form')
      .send({ email: 'bob@example.com', password: 'wrong-password' });
    expect(res.status).toBe(400);
  });

  it('reports not-authenticated without a session', async () => {
    const res = await request(app).get('/api/user/checkAuth');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ authenticated: false });
  });
});
