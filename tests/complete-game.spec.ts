import { test, expect } from '@playwright/test';

test('can start Complete and Classify game', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click on "Completar y Clasificar" button
  await page.getByRole('button', { name: 'Completar y Clasificar' }).click();

  // Check game title
  await expect(page.getByText('Completar y Clasificar')).toBeVisible();

  // Check for specific game elements
  await expect(
    page.getByRole('heading', {
      name: 'Completa la palabra con la sílaba tónica:',
    })
  ).toBeVisible();
});
