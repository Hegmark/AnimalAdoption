import { test, expect } from '@playwright/test';

// End-to-end user flow: a new adopter registers, logs in, opens an animal and
// submits an adoption request. After submitting, the detail page shows the
// "already requested" state — the UI side of the duplicate-request guard.
test('adopter registers, logs in and submits an adoption request', async ({ page }) => {
  const stamp = Date.now();
  const email = `adopter-${stamp}@example.com`;
  const password = 'secret123';

  // Auto-accept the success alert() shown after submitting.
  page.on('dialog', (dialog) => dialog.accept());

  await page.goto('/');
  const nav = page.getByRole('navigation');

  // The header menu is a hamburger — open it before using the nav links.
  await nav.getByText('☰').click();

  // Register (the app auto-logs in on success).
  await nav.getByText('Regisztráció', { exact: true }).click();
  await page.getByPlaceholder('Felhasználónév').fill(`user-${stamp}`);
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Jelszó').fill(password);
  await page.getByRole('button', { name: 'Regisztráció' }).click();

  // Logged in -> the logout link appears.
  await expect(nav.getByText('Kijelentkezés')).toBeVisible();

  // Open an animal from the list.
  await nav.getByRole('link', { name: 'Állatok' }).click();
  await expect(page).toHaveURL(/\/animals$/);
  await page.getByText('Mancs').first().click();
  await expect(page).toHaveURL(/\/animals\/\d+$/);

  // Submit an adoption request.
  await page.getByRole('button', { name: 'Örökbefogadás' }).click();
  await page.locator('#adoptionDate').fill('2026-12-15');
  await page.locator('#message').fill('Nagyon szeretném örökbefogadni.');
  await page.getByRole('button', { name: 'Küldés' }).click();

  // The detail page now reflects the submitted (duplicate-guarded) state.
  await expect(page.getByText('Örökbefogadási kérelem már benyújtva!')).toBeVisible();
});
