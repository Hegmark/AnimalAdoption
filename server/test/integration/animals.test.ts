import request from 'supertest';
import { createApp } from '../../src/app';
import { User } from '../../src/models/User';

const app = createApp();

async function adminAgent() {
  const agent = request.agent(app);
  await new User({ username: 'admin', email: 'admin@example.com', passwordHash: 'adminpw', role: 'admin', favorites: [] }).save();
  await agent.post('/api/user/login').type('form').send({ email: 'admin@example.com', password: 'adminpw' });
  return agent;
}

function createAnimal(agent: any, name = 'Rex') {
  return agent.post('/api/animals/create')
    .field('name', name).field('species', 'Kutya').field('breed', 'Keverék')
    .field('age', '3').field('description', 'leírás').field('temperament', 'vidám')
    .field('healthInfo', 'oltva').field('available', 'true');
}

describe('animals', () => {
  it('lets an admin create, list and fetch an animal', async () => {
    const admin = await adminAgent();

    const created = await createAnimal(admin);
    expect(created.status).toBe(201);
    expect(created.body.name).toBe('Rex');
    const animalId = created.body.animalId;
    expect(typeof animalId).toBe('number');

    const list = await request(app).get('/api/animals');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);

    const one = await request(app).get(`/api/animals/${animalId}`);
    expect(one.status).toBe(200);
    expect(one.body.name).toBe('Rex');
  });

  it('forbids a non-admin from creating an animal (403)', async () => {
    const agent = request.agent(app);
    await agent.post('/api/user/register').type('form')
      .send({ username: 'u', email: 'u@example.com', password: 'pw123456' });
    await agent.post('/api/user/login').type('form')
      .send({ email: 'u@example.com', password: 'pw123456' });

    const res = await agent.post('/api/animals/create').field('name', 'X');
    expect(res.status).toBe(403);
  });

  it('requires authentication to create an animal (401)', async () => {
    const res = await request(app).post('/api/animals/create').field('name', 'X');
    expect(res.status).toBe(401);
  });
});
