// @ts-check
const { test, expect } = require('@playwright/test');

test('Local Testing', async ({ page }) => {

  try{

  await page.waitForTimeout(5000);

  await page.goto('http://localhost:5500/');

  await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'reason for pass'}})}`);

} catch (e) {
  console.log(e);
  await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'reason for fail'}})}`);

}


});
