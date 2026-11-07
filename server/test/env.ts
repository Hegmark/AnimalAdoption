// Runs before the test framework and before any module is imported, so modules
// that read env at load time (mailer, app) see test-safe values.
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-session-secret';
// Point SMTP at a closed port so email sends fail fast and never reach a real server.
process.env.SMTP_HOST = process.env.SMTP_HOST || '127.0.0.1';
process.env.SMTP_PORT = process.env.SMTP_PORT || '59999';
