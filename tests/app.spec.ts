import { test, expect } from '@playwright/test';

test('has title and can set personalized greeting', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Check title
  await expect(page).toHaveTitle(/Entrenador de Palabras/);

  // Check default greeting with link
  await expect(
    page.getByRole('heading', { name: 'Entrenador de Palabras' })
  ).toBeVisible();
  await expect(page.getByText('¡Hola!')).toBeVisible();
  const settingsLink = page.getByRole('button', { name: '¿Cómo te llamas?' });
  await expect(settingsLink).toBeVisible();

  // Navigate to settings via link
  await settingsLink.click();

  // Verify we are in settings
  await expect(page.getByText('Configuración del Juego')).toBeVisible();

  // Set name
  await page.getByPlaceholder('Tu nombre').fill('Antón');
  await page.getByRole('button', { name: 'Guardar Configuración' }).click();

  // Go back
  await page.getByRole('button', { name: 'Volver' }).click();

  // Verify updated greeting
  await expect(page.getByText('¡Hola, Antón!')).toBeVisible();
});

test('can navigate to theory section', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click on "La Pizarra" button
  await page.getByRole('button', { name: 'La Pizarra' }).click();

  // Check for theory content
  await expect(
    page.getByRole('heading', { name: '¿Cómo se acentúan las palabras?' })
  ).toBeVisible();

  // Go back
  await page.getByRole('button', { name: 'Volver' }).click();
  await expect(
    page.getByRole('heading', { name: 'Entrenador de Palabras' })
  ).toBeVisible();
});

test('can start the Detective game', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click on "Detective" button
  await page.getByRole('button', { name: 'Detective de Sílabas' }).click();

  // Check game title
  await expect(page.getByText('Detective de Sílabas')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '¿Cuál es la sílaba tónica?' })
  ).toBeVisible();
});

test('can start the Classifier game', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click on "El Clasificador" button
  await page.getByRole('button', { name: 'El Clasificador' }).click();

  // Check game title
  await expect(page.getByText('El Clasificador')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '¿Qué tipo de palabra es?' })
  ).toBeVisible();
});
