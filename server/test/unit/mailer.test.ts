// The transport is mocked to always fail, so we can assert the retry/never-throw behaviour.
jest.mock('nodemailer', () => {
  const sendMail = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));
  const transport = { sendMail };
  return {
    __esModule: true,
    default: { createTransport: () => transport },
    createTransport: () => transport,
  };
});

import nodemailer from 'nodemailer';
import { sendAdoptionStatusEmail } from '../../src/mailer';

const transport: any = (nodemailer as any).createTransport();

describe('sendAdoptionStatusEmail', () => {
  beforeEach(() => transport.sendMail.mockClear());

  it('retries three times and resolves without throwing when SMTP fails', async () => {
    await expect(sendAdoptionStatusEmail('x@example.com', 'Rex', 'approved')).resolves.toBeUndefined();
    expect(transport.sendMail).toHaveBeenCalledTimes(3);
  });
});
