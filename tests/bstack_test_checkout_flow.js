const { expect, test } = require('@playwright/test');

test('BStackDemo test checkout flow', async ({ page }) => {
  // visit the site
  await page.goto('https://bstackdemo.com/');

  // sign in
  await page.click('#signin');
  await page.locator("#username svg").click();
  await page.locator("#react-select-2-option-0-0").click();
  await page.locator("#password svg").click();
  await page.locator("#react-select-3-option-0-0").click();

  await page.click('#login-btn');
  await page.waitForTimeout(500);

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
});
