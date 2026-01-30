import { test, expect } from '@playwright/test';

test('complete game works in input mode with fallback', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Start the game
  await page.getByRole('button', { name: 'Completar y Clasificar' }).click();

  // Verify we are in input mode (input field exists)
  const input = page.getByPlaceholder('...');
  await expect(input).toBeVisible();

  // Test incorrect input logic
  await input.fill('wrong');
  await page.getByRole('button', { name: 'Comprobar' }).click();

  // Should see error state (we can check for attempts count or class changes,
  // but let's check attempts text which is user visible)
  await expect(page.getByText('Intentos: 1/3')).toBeVisible();

  // Try again
  await input.fill('wrong2');
  await page.getByRole('button', { name: 'Comprobar' }).click();
  await expect(page.getByText('Intentos: 2/3')).toBeVisible();

  // Third strike - should switch to choice mode
  await input.fill('wrong3');
  await page.getByRole('button', { name: 'Comprobar' }).click();

  // Wait for the switch (there is a 1s delay in code)
  await expect(input).not.toBeVisible({ timeout: 5000 });

  // Now options should be visible (buttons)
  // We can't know exact buttons easily without knowing the word,
  // but we can check there are buttons that are NOT "Comprobar"
  // There should be 3 options + maybe "Salir" in header.
  // The game renders 3 option buttons in choice mode.
  // Let's look for the container grid or specific class logic if needed,
  // but finding > 0 buttons is a good start.
  // Actually, the previous test `complete-game.spec.ts` checked for title etc.
  // Here we just want to verify the fallback happened.

  // We expect at least 3 option buttons now.
  // The option buttons have classes like `px-8 py-4`
  await expect(page.locator('.px-8.py-4')).toHaveCount(3);
});
