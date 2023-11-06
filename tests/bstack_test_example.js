const { expect, test } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('span').filter({ hasText: 'Sign In' }).click();      
  await page.getByLabel('Username', { exact: true }).click();
  await page.getByLabel('Username', { exact: true }).fill('dhanasai.kumargorrela@nttdata.com');      
  await page.getByLabel('Password', { exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('India19191');
  await page.getByLabel('sign in button').click(); 
  await page.waitForEvent("load");
});

test('add to cart', async ({page}) => {

await page.getByRole('menuitem', { name: 'SHOP' }).click();
await page.locator('#ProductMenuRedesign').getByRole('link').first().click();
await page.locator('#ProductMenuRedesign div').getByRole('list').first().click();
await page.locator('li').filter({ hasText: 'Add to Cart' }).getByRole('button').first().click();
await page.getByText('View Cart').click();

});


/*test('view and checkout cart', async ({page}) => {
await expect(page.locator('#accountmenuDiv > div.cart-menu > span > img')).toBeVisible({timeout:30000});
await page.locator('#accountmenuDiv > div.cart-menu > span > img').click();
await expect(page.getByRole('button', { name: 'CHECKOUT' })).toBeVisible({timeout:30000});
await page.getByRole('button', { name: 'CHECKOUT' }).click();
 await expect(page.getByText('Pay by Credit Card')).toBeVisible({timeout:30000});
 await page.getByText('Pay by Credit Card').click();
 await expect(page.getByRole('button', { name: 'New Card' })).toBeVisible({timeout:30000});
 await page.getByRole('button', { name: 'New Card' }).click();
 await expect(page.locator('#creditCardRows').getByText('Master Card')).toBeVisible({timeout:30000});
 await page.locator('#creditCardRows').getByText('Master Card').click();  
});
test('Orderplacement', async ({ page }) => {

  await page.getByRole('menuitem', { name: 'SHOP' }).click();
  await page.locator('#ProductMenuRedesign').getByRole('link').first().click();
  await page.locator('#ProductMenuRedesign div').getByRole('list').first().click();
  await page.locator('li').filter({ hasText: 'Add to Cart' }).getByRole('button').first().click();
  await page.getByText('View Cart').click();
  await page.getByRole('button', { name: 'CHECKOUT' }).click();
  await page.getByLabel('Purchase Order').click();
  await page.getByLabel('Purchase Order').fill('testing');
  await page.getByLabel('Reference Number').click();
  await page.getByLabel('Reference Number').fill('Testing');
  await page.getByRole('link', { name: 'Place Order' }).click();*/


