import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Spin up a throwaway in-memory MongoDB for the whole test file, and reset the
// data between tests so each case starts from a clean database.
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
