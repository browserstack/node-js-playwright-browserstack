# node-js-playwright-browserstack
This repo contains samples for running [Playwright](https://playwright.dev/docs/intro) tests on BrowserStack using the browserstack-node-sdk.

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

## Setup

* Clone the repo `git clone -b sdk https://github.com/browserstack/node-js-playwright-browserstack.git` and run `cd node-js-playwright-browserstack`.
* Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` as environment variables with your [BrowserStack Username and Access Key](https://www.browserstack.com/accounts/settings) or update the same in `browserstack.yml` file.
* Run `npm i` to install the dependencies.

## Running your tests

- To run the sample tests in parallel across the platforms specified in the `browserstack.yml`, run `npm run sample-test`.
- To run the sample local tests in parallel across the platforms specified in the `browserstack.yml`, run `npm run sample-local-test`.

## Notes
* You can view your test results on the [BrowserStack Automate dashboard](https://www.browserstack.com/automate)
* Understand how many parallel sessions you need by using our [Parallel Test Calculator](https://www.browserstack.com/automate/parallel-calculator?ref=github)
