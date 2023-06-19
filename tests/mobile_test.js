const { test } = require('../mobile-fixture');
const { expect } = require('@playwright/test');

test.describe('feature foo', () => {

    test.beforeEach(async ({ page }) => {
        
        await page.goto('https://duckduckgo.com/')
            })


test('BstackDemo Add to cart', async ({page}) => {

    
    const element = await page.$('[id="searchbox_homepage"]');
    await page.click('#searchbox_homepage');
    await element.type('BrowserStack');
    await element.press('Enter');
    const title = await page.title();
    console.log(title);

});
});
