const { expect, test } = require('@playwright/test');

let page;
const baseUrl = 'https://the-internet.herokuapp.com/';

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();

  await page.goto(baseUrl);

  await page.waitForTimeout(3000);

  await expect(page).toHaveTitle('The Internet');

  // await page.getByRole('link', { name: 'Checkboxes' }).click();

  // const checkbox1 = page.getByRole('checkbox').first();
  // const checkbox2 = page.getByRole('checkbox').last();

  // expect(await checkbox1.isChecked()).toBe(false);
  // await checkbox1.check();
  // expect(await checkbox1.isChecked()).toBe(true);

  // expect(await checkbox2.isChecked()).toBe(true);
  // await checkbox2.uncheck();
  // expect(await checkbox2.isChecked()).toBe(false);

  // await page.goto(baseUrl);
  // await page.getByRole('link', { name: 'Dropdown' }).click();

  // const dropdown = page.locator('#dropdown');
  // await dropdown.selectOption({ label: 'Option 1' });

  // await page.goBack();
});

test('flaky test - intermittently passes and fails', async () => {
  const headingName = Math.random() > 0.7 ? 'Available Examples' : 'Some Other Heading';
  const availableExamples = page.getByRole('heading', { name: headingName });
  const headingText = await availableExamples.textContent();
  expect(headingText).toContain('Available Examples');
});

test('always failing test - incorrect page title', { tag: ['@regression'] }, async () => {
  await page.goto(baseUrl);

  await page.waitForTimeout(3000);

  await expect(page).toHaveTitle('Wrong title');
});

test('always failing test - same stacktrace 1', async () => {
  throw new Error("NullPointerError: Cannot read property 'foo' of null");
});

// test('always failing test - same stacktrace 2', async () => {
//   throw new Error("NullPointerError: Cannot read property 'foo' of null");
// });

test('always pasing test - example F', async () => {
  expect(true).toBe(true);
});

test('always pasing test - example G', async () => {
  expect(true).toBe(true);
});

// test('always pasing test - example H', async () => {
//   expect(true).toBe(true);
// });

test('always pasing test - example I', { tag: ['@p1'] }, async () => {
  expect(true).toBe(true);
});

test('always passing test - verify page title', async () => {
  await page.goto(baseUrl);

  await page.waitForTimeout(3000);

  await expect(page).toHaveTitle('The Internet');
})

test.describe(() => {
  test.describe.configure({ retries: 2 });

  test('Test with framework-level retry - 2 retries configured', async () => {
    const randomOutcome = Math.random() > 0.7; // 30% chance of passing
    if (!randomOutcome) {
      throw new Error("Test failed, retrying...");
    }
  });  
});

// test.describe(() => {
//   test.describe.configure({ retries: 2 });

//   test('Another Test with framework-level retry - 2 retries configured', async () => {
//     const randomOutcome = Math.random() > 0.7; // 30% chance of passing
//     if (!randomOutcome) {
//       throw new Error("Test failed, retrying...");
//     }
//   });
// });

test.afterAll(async () => {
  await page.close();
});
