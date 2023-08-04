// @ts-check
const { test } = require("../fixture");
const { expect } = require("@playwright/test");

test("Local Testing", async ({ page }, testInfo) => {
  try {
    await page.evaluate((_) => {},
    `browserstack_executor: ${JSON.stringify({ action: "setSessionName", arguments: { name: testInfo.project.name } })}`);

    await page.waitForTimeout(5000);

    await page.goto("http://localhost:5500/");

    await page.evaluate((_) => {},
    `browserstack_executor: ${JSON.stringify({ action: "setSessionStatus", arguments: { status: "passed", reason: "Local success" } })}`);
  } catch (e) {
    console.log(e);
    await page.evaluate((_) => {},
    `browserstack_executor: ${JSON.stringify({ action: "setSessionStatus", arguments: { status: "failed", reason: "Local fail" } })}`);
  }
});
