// Phase 0 — idempotent database seed.
// Creates an admin user, a few sample animals, and a news item so a fresh
// (containerized) MongoDB is immediately usable, without hand-editing roles.
//
// Run with:  npm run seed   (server/.env must point MONGODB_URI at the DB)
//
// Safe to re-run: it only inserts what is missing.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Animal } from './models/Animal';
import { News } from './models/News';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Copy server/.env.example to server/.env, or set it in the environment.');
  process.exit(1);
}

// Dev-only default admin credentials. These are not secrets and are meant to be
// changed; they exist so a fresh environment has a working admin login.
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const sampleAnimals = [
  {
    name: 'Mancs', species: 'Kutya', breed: 'Keverék', age: 3,
    description: 'Barátságos és energikus kutya, aki egy aktív családot keres.',
    temperament: 'Játékos', healthInfo: 'Oltva, ivartalanítva.',
    images: ['/uploads/1746207978517-mancs.jpg'], available: true
  },
  {
    name: 'Cirmos', species: 'Macska', breed: 'Európai rövidszőrű', age: 2,
    description: 'Nyugodt lakásmacska, aki imádja a napsütötte ablakpárkányokat.',
    temperament: 'Nyugodt', healthInfo: 'Oltva, féregtelenítve.',
    images: ['/uploads/1746208054272-cirmos.png'], available: true
  },
  {
    name: 'Bodri', species: 'Kutya', breed: 'Puli', age: 5,
    description: 'Hűséges őrző, jól kijön a gyerekekkel.',
    temperament: 'Védelmező', healthInfo: 'Oltva.',
    images: ['/uploads/1746208105248-bodri.jpg'], available: true
  },
  {
    name: 'Nyuszi', species: 'Nyúl', breed: 'Törpe', age: 1,
    description: 'Kicsi, kíváncsi nyúl, aki gyengéd otthonra vágyik.',
    temperament: 'Félénk', healthInfo: 'Egészséges.',
    images: ['/uploads/1746208165159-nyuszi.jpg'], available: true
  }
];

async function seed(uri: string) {
  await mongoose.connect(uri);
  console.log(`Seeding ${uri} ...`);

  // Admin user
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    await new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_PASSWORD, // hashed by the User pre-save hook
      role: 'admin',
      favorites: []
    }).save();
    console.log(`  + admin user created (${ADMIN_EMAIL} / ${ADMIN_PASSWORD})`);
  } else {
    console.log('  = admin user already exists, skipping');
  }

  // Animals
  const animalCount = await Animal.countDocuments();
  if (animalCount === 0) {
    for (const a of sampleAnimals) {
      await new Animal({ ...a, createdAt: new Date() }).save(); // save() so animalId auto-increments
    }
    console.log(`  + ${sampleAnimals.length} sample animals created`);
  } else {
    console.log(`  = ${animalCount} animals already present, skipping`);
  }

  // News
  const newsCount = await News.countDocuments();
  if (newsCount === 0) {
    await new News({
      title: 'Üdvözlünk az Állatörökbefogadási Platformon',
      content: 'Böngéssz állataink között, és nyújts be egy örökbefogadási kérelmet, hogy elkezdhesd!'
    }).save();
    console.log('  + sample news item created');
  } else {
    console.log(`  = ${newsCount} news items already present, skipping`);
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed(MONGODB_URI).catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
