/* eslint-env jest */
const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

const uploadPath = path.join('.', 'public', 'uploads', 'iiif');
const editUrl = 'http://localhost:8080/edit/test/diva-test';

jest.setTimeout('15000');

beforeAll(() => {
  // Link test folder
  fs.linkSync(path.join('.', 'test', 'test'), path.join(uploadPath, 'test'));
});

afterAll(() => {
  fs.unlinkSync(path.join(uploadPath, 'test'));
});

describe.each(['firefox', 'chrome', 'safari'])('Tests on %s', (title) => {
  var browser;

  beforeAll(async () => {
    browser = await new Builder()
      .forBrowser(title)
      .setFirefoxOptions(new firefox.Options().headless())
      .setChromeOptions(new chrome.Options().headless().windowSize({ width: 1280, height: 800 }))
      .build();
    await browser.get(editUrl);
  });

  afterAll(() => {
    browser.quit();
  });

  describe('Neon Basics', () => {
    test('Render Page', async () => {
      const title = await browser.getTitle();
      expect(title).toBe('Neon');
    });
  });
});
