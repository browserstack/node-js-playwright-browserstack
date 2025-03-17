const { expect, test } = require("@playwright/test");
const sleep = require("util").promisify(setTimeout);
test("BStack local is working", async ({ page }) => {
    await page.goto("http://bs-local.com:45454/");
    const title = await page.title();
    expect(title).toContain("BrowserStack Local");
});

test("Deliberately fail to trigger CI failure strategy", async () => {
    await page.goto("http://bs-local.com:45454/");
    const title = await page.title();
    expect(title).toContain("FFFFFFFF");
});

test("Deliberately throw to trigger CI failure strategy", async () => {
    await page.goto("http://bs-local.com:45454/");
    const title = await page.title();
    throw new Error("Got a runtime error");
});
