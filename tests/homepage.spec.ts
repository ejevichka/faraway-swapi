import { test, expect } from '@playwright/test';

test('HomePage displays main heading with correct Tailwind classes', async ({ page }) => {

  await page.goto('http://localhost:3000');

  const heading = page.locator('h1:text("Star Wars Characters")');
  await expect(heading).toBeVisible();

  const classes = await heading.getAttribute('class');
  console.log("Heading classes:", classes);

  expect(classes).toContain('text-neonGreen');
  expect(classes).toContain('mt-8');
  expect(classes).toContain('text-center');
  expect(classes).toContain('text-4xl');
  expect(classes).toContain('font-extrabold');
  expect(classes).toContain('text-white');
});
