const { expect, test } = require('@playwright/test');
const sleep = require('util').promisify(setTimeout)
test('BStack local is working', async ({ page }) => {
  await page.goto('http://bs-local.com:45454/');
  const title = await page.title();
  expect(title).toContain('BrowserStack Local');
});
