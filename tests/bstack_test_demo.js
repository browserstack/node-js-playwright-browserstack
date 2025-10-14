const { expect, test } = require('@playwright/test');

test('Browserstack playwright demo', async ({ page }) => {
  const baseUrl = 'https://the-internet.herokuapp.com/';

  await page.goto(baseUrl);

  await page.waitForTimeout(3000);

  await expect(page).toHaveTitle('The Internet');

  await page.getByRole('link', { name: 'Checkboxes' }).click();

  const checkbox1 = page.getByRole('checkbox').first();
  const checkbox2 = page.getByRole('checkbox').last();

  expect(await checkbox1.isChecked()).toBe(false);
  await checkbox1.check();
  expect(await checkbox1.isChecked()).toBe(true);

  expect(await checkbox2.isChecked()).toBe(true);
  await checkbox2.uncheck();
  expect(await checkbox2.isChecked()).toBe(false);

  await page.goto(baseUrl);
  await page.getByRole('link', { name: 'Dropdown' }).click();

  const dropdown = page.locator('#dropdown');
  await dropdown.selectOption({ label: 'Option 1' });

  await page.goBack();

  const availableExamples = page.getByRole('heading', { name: 'Available Examples' });
  const headingText = await availableExamples.textContent();
  expect(headingText).toContain('Available Examples');
});
