const base = require('@playwright/test');
const cp = require('child_process');
const { _android } = require('playwright');
const clientPlaywrightVersion = cp
  .execSync('npx playwright --version')
  .toString()
  .trim()
  .split(' ')[1];
const BrowserStackLocal = require('browserstack-local');
const util = require('util');
const { test } = require('./browserstack.config');

// BrowserStack Specific Capabilities.
// Set 'browserstack.local:true For Local testing
const caps = {
    "osVersion": "12.0",
    "deviceName": "Samsung Galaxy S23", // "Samsung Galaxy S22 Ultra", "Google Pixel 7 Pro", "OnePlus 9", etc.
    "browserName": "chrome",
    "realMobile": "true",
    'name': 'My android playwright test',
    'build': 'playwright-build-1',
    'browserstack.username': process.env.BROWSERSTACK_USERNAME || '<USERNAME>',
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || '<ACCESS_KEY>',
  };

exports.bsLocal = new BrowserStackLocal.Local();

// replace YOUR_ACCESS_KEY with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
exports.BS_LOCAL_ARGS = {
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'ACCESSKEY',
};

// Patching the capabilities dynamically according to the project name.
const patchMobileCaps = (name, title) => {
  let combination = name.split(/@browserstack/)[0];
  let [browerCaps, osCaps] = combination.split(/:/);
  let [browser, deviceName] = browerCaps.split(/@/);
  let osCapsSplit = osCaps.split(/ /);
  let os = osCapsSplit.shift();
  let osVersion = osCapsSplit.join(' ');
  caps.browser = browser ? browser : 'chrome';
  caps.deviceName = deviceName ? deviceName : 'Samsung Galaxy S22 Ultra';
  caps.osVersion = osVersion ? osVersion : '12.0';
  caps.name = title;
  caps.realMobile='true';
};

exports.test = base.test.extend({
  page: async({baseURL}, use, testInfo) => {
   if (testInfo.project.name.match(/browserstack/)) {
    patchMobileCaps(testInfo.project.name, `${testInfo.file} - ${testInfo.title}`);     
     console.log(caps);
      const device = await base._android.connect(`wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`);
      console.log(device.model());
      console.log(device.serial());
      console.info('using browserStack browser');
      await device.shell('am force-stop com.android.chrome');
      const context = await device.launchBrowser({
        baseURL: baseURL
      });
      const page = await context.newPage(); 
     await use(page);
     
      await context.close();
      await device.close();
   } else {
     console.info('using local browser');
     //use(browser);
   }
 },

 beforeEach: [async ({ page }, use) => {
    await page.context().tracing.start({ screenshots: true, snapshots: true, sources: true })
    await use()
}, { auto: true }],

afterEach: [async ({ page }, use, testInfo) => {
    await use()
    if (testInfo.status == 'failed') {
        await page.context().tracing.stop({ path: `${testInfo.outputDir}/trace.zip` })
        await page.screenshot({ path: `${testInfo.outputDir}/screenshot.png` })
        await testInfo.attach('screenshot', { path: `${testInfo.outputDir}/screenshot.png`, contentType: 'image/png' });
        await testInfo.attach('trace', { path: `${testInfo.outputDir}/trace.zip`, contentType: 'application/zip' });
    }
}, { auto: true }],
}); 


exports.getMobileEndpoint =  (name, title, ) => {
  patchMobileCaps(name, title)   
  delete caps.os_version; 
  delete caps.os;
  console.log(caps);
  const cdpUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`

  console.log(`--> ${cdpUrl}`)
  return cdpUrl;
}
