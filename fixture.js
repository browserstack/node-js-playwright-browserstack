const base = require('@playwright/test');
const cp = require('child_process');
const clientPlaywrightVersion = cp
  .execSync('npx playwright --version')
  .toString()
  .trim()
  .split(' ')[1];

// BrowserStack Specific Capabilities
const caps = {
  browserName: 'playwright-chromium',
  'bstack:options': {
    username: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    sessionName: 'playwright-test',
    buildName: 'playwright-build-1',
    os: 'linux',
    networkLogs: true,
    playwrightVersion: clientPlaywrightVersion
  }
};

const patchCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps] = combination.split(/:/);
  let [browser, browserVersion] = browerCaps.split(/@/);
  caps['bstack:options'].sessionName = title;
  caps.browserName = browser ? browser : 'chrome';
  caps.browserVersion = browserVersion ? browserVersion : 'latest';
};

const isHash = (entity) =>
  Boolean(entity && typeof entity === 'object' && !Array.isArray(entity));
const nestedKeyValue = (hash, keys) =>
  keys.reduce((hash, key) => (isHash(hash) ? hash[key] : undefined), hash);
const isUndefined = (val) => val === undefined || val === null || val === '';
const evaluateSessionStatus = (status) => {
  if (!isUndefined(status)) {
    status = status.toLowerCase();
  }
  if (status === 'passed') {
    return 'passed';
  } else if (status === 'failed' || status === 'timedout') {
    return 'failed';
  } else {
    return '';
  }
};

exports.test = base.test.extend({
  page: async ({ page, playwright }, use, testInfo) => {
    if (testInfo.project.name.match(/browserstack/)) {
      let vBrowser, vContext;
      patchCaps(testInfo.project.name, `${testInfo.title}`);
      vBrowser = await playwright.chromium.connect({
        wsEndpoint:
          `wss://<YOUR_HUB_URL>/playwright?caps=` +
          `${encodeURIComponent(JSON.stringify(caps))}`,
          timeout: 0
      });
      vContext = await vBrowser.newContext(testInfo.project.use);
      const vPage = await vContext.newPage();

      await use(vPage);

      await vPage.close();
      await vBrowser.close();
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
      if (testInfo.status == 'failed') {
        await page
          .context()
          .tracing.stop({ path: `${testInfo.outputDir}/trace.zip` });
        await page.screenshot({ path: `${testInfo.outputDir}/screenshot.png` });
        await testInfo.attach('screenshot', {
          path: `${testInfo.outputDir}/screenshot.png`,
          contentType: 'image/png',
        });
        await testInfo.attach('trace', {
          path: `${testInfo.outputDir}/trace.zip`,
          contentType: 'application/zip',
        });
      }
    },
    { auto: true },
  ],
});
