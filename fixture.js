const base = require("@playwright/test");
const cp = require("child_process");
const { _android } = require("playwright");
const clientPlaywrightVersion = cp
  .execSync("npx playwright --version")
  .toString()
  .trim()
  .split(" ")[1];
const BrowserStackLocal = require("browserstack-local");
const util = require("util");

// BrowserStack Specific Capabilities.
// Set 'browserstack.local:true For Local testing
const caps = {
  osVersion: "13.0",
  deviceName: "Samsung Galaxy S23", // "Samsung Galaxy S22 Ultra", "Google Pixel 7 Pro", "OnePlus 9", etc.
  browserName: "chrome",
  realMobile: "true",
  name: "My android playwright test",
  build: "playwright-build-1",
  "browserstack.username": process.env.BROWSERSTACK_USERNAME || "<USERNAME>",
  "browserstack.accessKey":
    process.env.BROWSERSTACK_ACCESS_KEY || "<ACCESS_KEY>",
  "browserstack.local": process.env.BROWSERSTACK_LOCAL || false,
};

exports.bsLocal = new BrowserStackLocal.Local();

// replace YOUR_ACCESS_KEY with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
exports.BS_LOCAL_ARGS = {
  key: process.env.BROWSERSTACK_ACCESS_KEY || "ACCESSKEY",
};

// Patching the capabilities dynamically according to the project name.
const patchMobileCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, deviceName] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let osVersion = osCapsSplit.join(" ");
  caps.browser = browser ? browser : "chrome";
  caps.deviceName = deviceName ? deviceName : "Samsung Galaxy S22 Ultra";
  caps.osVersion = osVersion ? osVersion : "12.0";
  caps.name = title;
  caps.realMobile = "true";
};

const patchCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, browser_version] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let os_version = osCapsSplit.join(" ");
  caps.browser = browser ? browser : "chrome";
  caps.browser_version = browser_version ? browser_version : "latest";
  caps.os = os ? os : "osx";
  caps.os_version = os_version ? os_version : "catalina";
  caps.name = title;
};

const isHash = (entity) =>
  Boolean(entity && typeof entity === "object" && !Array.isArray(entity));
const nestedKeyValue = (hash, keys) =>
  keys.reduce((hash, key) => (isHash(hash) ? hash[key] : undefined), hash);
const isUndefined = (val) => val === undefined || val === null || val === "";
const evaluateSessionStatus = (status) => {
  if (!isUndefined(status)) {
    status = status.toLowerCase();
  }
  if (status === "passed") {
    return "passed";
  } else if (status === "failed" || status === "timedout") {
    return "failed";
  } else {
    return "";
  }
};

exports.test = base.test.extend({
  page: async ({ page, playwright }, use, testInfo) => {
    if (testInfo.project.name.match(/browserstack/)) {
      let vBrowser, vContext, vDevice;
      const isMobile = testInfo.project.name.match(/browserstack-mobile/);
      if (isMobile) {
        patchMobileCaps(
          testInfo.project.name,
          `${testInfo.file} - ${testInfo.title}`
        );
        vDevice = await playwright._android.connect(
          `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify(caps)
          )}`
        );
        await vDevice.shell("am force-stop com.android.chrome");
        vContext = await vDevice.launchBrowser();
      } else {
        patchCaps(testInfo.project.name, `${testInfo.title}`);
        delete caps.osVersion;
        delete caps.deviceName;
        delete caps.realMobile;
        vBrowser = await playwright.chromium.connect({
          wsEndpoint:
            `wss://cdp.browserstack.com/playwright?caps=` +
            `${encodeURIComponent(JSON.stringify(caps))}`,
        });
        vContext = await vBrowser.newContext(testInfo.project.use);
      }
      const vPage = await vContext.newPage();
      await use(vPage);

      await vPage.close();

      if (isMobile) {
        await vDevice.close();
      } else {
        await vBrowser.close();
      }
    } else {
      use(page);
    }
  },

  beforeEach: [
    async ({ page }, use) => {
      await page
        .context()
        .tracing.start({ screenshots: true, snapshots: true, sources: true });
      await use();
    },
    { auto: true },
  ],

  afterEach: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status == "failed") {
        await page
          .context()
          .tracing.stop({ path: `${testInfo.outputDir}/trace.zip` });
        await page.screenshot({ path: `${testInfo.outputDir}/screenshot.png` });
        await testInfo.attach("screenshot", {
          path: `${testInfo.outputDir}/screenshot.png`,
          contentType: "image/png",
        });
        await testInfo.attach("trace", {
          path: `${testInfo.outputDir}/trace.zip`,
          contentType: "application/zip",
        });
      }
    },
    { auto: true },
  ],
});
