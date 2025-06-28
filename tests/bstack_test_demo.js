const { expect, test } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("https://bstackdemo.com/");
});

test("BStackDemo test home page", async ({ page }) => {
  const title = await page.title();
  expect(title).toContain("StackDemo");
});

test("BStackDemo test home page logo", async ({ page }) => {
  await page.locator(".Navbar_logo__2655Y").isVisible();
});

test("BStackDemo test attribute", async ({ page }) => {
  const links = page.locator("a");
  const count = await links.count();
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");

    if (i === 0) {
      expect(href).toEqual("/");
    }
  }
});
