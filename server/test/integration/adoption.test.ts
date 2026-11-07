// The mailer is mocked so the workflow test never touches a real SMTP server.
jest.mock('../../src/mailer', () => ({
  __esModule: true,
  sendAdoptionStatusEmail: jest.fn().mockResolvedValue(undefined),
}));

import request from 'supertest';
import { createApp } from '../../src/app';
import { User } from '../../src/models/User';
import { sendAdoptionStatusEmail } from '../../src/mailer';

const app = createApp();
const mailMock = sendAdoptionStatusEmail as jest.Mock;

async function adminAgent() {
  const agent = request.agent(app);
  await new User({ username: 'admin', email: 'admin@example.com', passwordHash: 'adminpw', role: 'admin', favorites: [] }).save();
  await agent.post('/api/user/login').type('form').send({ email: 'admin@example.com', password: 'adminpw' });
  return agent;
}

async function adopterAgent(email: string) {
  const agent = request.agent(app);
  await agent.post('/api/user/register').type('form').send({ username: email, email, password: 'pw123456' });
  await agent.post('/api/user/login').type('form').send({ email, password: 'pw123456' });
  return agent;
}

function createAnimal(agent: any) {
  return agent.post('/api/animals/create')
    .field('name', 'Rex').field('species', 'Kutya').field('breed', 'Keverék')
    .field('age', '3').field('description', 'd').field('temperament', 't')
    .field('healthInfo', 'h').field('available', 'true');
}

describe('adoption workflow', () => {
  beforeEach(() => mailMock.mockClear());

  it('approving one request auto-rejects the others and marks the animal unavailable', async () => {
    const admin = await adminAgent();
    const animalId = (await createAnimal(admin)).body.animalId;

    const adopter1 = await adopterAgent('a1@example.com');
    const adopter2 = await adopterAgent('a2@example.com');
    await adopter1.post('/api/adoption/create').send({ animalId, message: 'kérem', adoptionDate: '2026-12-01' });
    await adopter2.post('/api/adoption/create').send({ animalId, message: 'én is', adoptionDate: '2026-12-02' });

    const before = await admin.get('/api/adoption');
    const req1 = before.body.find((r: any) => r.userId.email === 'a1@example.com');
    const req2 = before.body.find((r: any) => r.userId.email === 'a2@example.com');
    expect(req1.status).toBe('pending');
    expect(req2.status).toBe('pending');

    const approve = await admin.put(`/api/adoption/update/${req1.adReId}`).send({ status: 'approved' });
    expect(approve.status).toBe(200);

    const after = await admin.get('/api/adoption');
    const a1 = after.body.find((r: any) => r.userId.email === 'a1@example.com');
    const a2 = after.body.find((r: any) => r.userId.email === 'a2@example.com');
    expect(a1.status).toBe('approved');
    expect(a2.status).toBe('rejected');

    const animal = await request(app).get(`/api/animals/${animalId}`);
    expect(animal.body.available).toBe(false);

    // Let the fire-and-forget notifications run, then assert both adopters were emailed.
    await new Promise((r) => setTimeout(r, 200));
    expect(mailMock).toHaveBeenCalledTimes(2);
  });

  it('rejects a duplicate pending request from the same adopter (400)', async () => {
    const admin = await adminAgent();
    const animalId = (await createAnimal(admin)).body.animalId;
    const adopter = await adopterAgent('dup@example.com');

    const first = await adopter.post('/api/adoption/create').send({ animalId, message: '1', adoptionDate: '2026-12-01' });
    expect(first.status).toBe(201);

    const second = await adopter.post('/api/adoption/create').send({ animalId, message: '2', adoptionDate: '2026-12-02' });
    expect(second.status).toBe(400);
  });
});
