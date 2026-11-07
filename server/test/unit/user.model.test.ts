import { User } from '../../src/models/User';

describe('User model', () => {
  it('hashes the password on save (does not store plaintext)', async () => {
    const user = await new User({
      username: 'u', email: 'u@example.com', passwordHash: 'plaintext', role: 'adopter', favorites: []
    }).save();
    expect(user.passwordHash).not.toBe('plaintext');
    expect(user.passwordHash.length).toBeGreaterThan(20);
  });

  it('comparePassword accepts the correct password and rejects a wrong one', async () => {
    const user = await new User({
      username: 'u2', email: 'u2@example.com', passwordHash: 'secret', role: 'adopter', favorites: []
    }).save();

    const ok = await new Promise<boolean>((resolve) =>
      user.comparePassword('secret', (_e, m) => resolve(m)));
    const bad = await new Promise<boolean>((resolve) =>
      user.comparePassword('wrong', (_e, m) => resolve(m)));

    expect(ok).toBe(true);
    expect(bad).toBe(false);
  });
});
