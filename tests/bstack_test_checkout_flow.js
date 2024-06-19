const { expect, test } = require('@playwright/test');

test('BStackDemo test checkout flow', async ({ page }) => {
  // visit the site
  await page.goto('https://bstackdemo.com/');

  // sign in
  await page.click('#signin', { delay: 100 });
  await page.fill('#react-select-2-input', 'fav_user');
  await page.press('#react-select-2-input', 'Enter');
  await page.fill('#react-select-3-input', 'testingisfun99');
  await page.press('#react-select-3-input', 'Enter');
  await page.click('#login-btn');
  await page.waitForNavigation();

  // click on buy item
  await page.click('#\\31 > .shelf-item__buy-btn');
  await page.click('div.float-cart__close-btn');
  await page.click('#\\32 > .shelf-item__buy-btn');
  await page.click('.buy-btn');

  // add address details
  await page.fill('#firstNameInput', 'first');
  await page.fill('#lastNameInput', 'last');
  await page.fill('#addressLine1Input', 'address');
  await page.fill('#provinceInput', 'province');
  await page.fill('#postCodeInput', 'pincode');

  // checkout
  await page.click('#checkout-shipping-continue');
  await page.click('text=Continue');
  await page.click('text=Orders');

  const list = page.locator('.a-fixed-left-grid-inner');
  await expect(list).toHaveCount(2);
});
