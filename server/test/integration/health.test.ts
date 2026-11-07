import request from 'supertest';
import { createApp } from '../../src/app';

describe('GET /health', () => {
  it('reports ok when the database is connected', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'up' });
  });
});
