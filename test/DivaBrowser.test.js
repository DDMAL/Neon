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

  describe('Check Display Panel', () => {
    beforeAll(async () => {
      // Ensure document loaded
      await browser.wait(until.elementLocated(By.id('opacitySlider')), 2000);
    });

    test('Check Glyph Opacity', async () => {
      // Set opacity to 0
      let glyphOpacitySlider = await browser.findElement(By.id('opacitySlider'));
      let rect = await glyphOpacitySlider.getRect();
      await browser.actions().dragAndDrop(glyphOpacitySlider, { x: -1 * parseInt(rect.width / 2), y: 0 }).perform();
      let opacityText = await browser.findElement(By.id('opacityOutput')).getText();
      expect(opacityText).toBe('0');
      let containerStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(containerStyle).toContain('opacity: 0;');

      // Reset opacity to 1
      let opacityButton = await browser.findElement(By.id('reset-opacity'));
      await browser.actions().click(opacityButton).perform();
      opacityText = await browser.findElement(By.id('opacityOutput')).getText();
      containerStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(opacityText).toBe('100');
      expect(containerStyle).toContain('opacity: 1;');
    });
  });
});
