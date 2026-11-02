// Email notifications via SMTP (MailHog in dev/test). Sending is best-effort:
// failures are retried a few times and then logged, never thrown to the caller,
// so a failed email can never break the adoption workflow.

import nodemailer, { SendMailOptions } from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '1025', 10);
const MAIL_FROM = process.env.MAIL_FROM || 'Örökbefogadás <no-reply@orokbefogadas.local>';

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  ignoreTLS: true
});

export type AdoptionStatus = 'approved' | 'rejected';

const SUBJECTS: Record<AdoptionStatus, string> = {
  approved: 'Örökbefogadási kérelmedet jóváhagytuk',
  rejected: 'Örökbefogadási kérelmed elbírálásáról'
};

function buildBody(animalName: string, status: AdoptionStatus): string {
  if (status === 'approved') {
    return `Kedves Örökbefogadó!\n\n` +
      `Örömmel értesítünk, hogy ${animalName} örökbefogadására benyújtott kérelmedet jóváhagytuk. ` +
      `Hamarosan felvesszük veled a kapcsolatot a további részletekkel.\n\n` +
      `Üdvözlettel,\nAz Örökbefogadás csapata`;
  }
  return `Kedves Örökbefogadó!\n\n` +
    `Sajnálattal értesítünk, hogy ${animalName} örökbefogadására benyújtott kérelmedet nem tudtuk jóváhagyni.\n\n` +
    `Köszönjük érdeklődésed, és reméljük, hamarosan megtalálod a hozzád illő társat.\n\n` +
    `Üdvözlettel,\nAz Örökbefogadás csapata`;
}

async function sendWithRetry(options: SendMailOptions, attempts = 3): Promise<void> {
  for (let i = 1; i <= attempts; i++) {
    try {
      await transport.sendMail(options);
      return;
    } catch (err) {
      console.error(`Email send attempt ${i}/${attempts} failed:`, (err as Error).message);
      if (i === attempts) throw err;
      await new Promise(resolve => setTimeout(resolve, 500 * i));
    }
  }
}

// Sends the status email, retrying on failure. Never throws: on final failure it
// logs and returns, so the caller's workflow is unaffected.
export async function sendAdoptionStatusEmail(to: string, animalName: string, status: AdoptionStatus): Promise<void> {
  try {
    await sendWithRetry({
      from: MAIL_FROM,
      to,
      subject: SUBJECTS[status],
      text: buildBody(animalName, status)
    });
    console.log(`Adoption ${status} email sent to ${to}`);
  } catch (err) {
    console.error(`Giving up on adoption ${status} email to ${to}:`, (err as Error).message);
  }
}
