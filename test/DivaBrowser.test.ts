/* eslint-env jest */
import * as fs from 'fs-extra';
import { Builder, By, until } from 'selenium-webdriver';
import { Preferences, Type, Level } from 'selenium-webdriver/lib/logging';
import * as firefox from 'selenium-webdriver/firefox';
import * as chrome from 'selenium-webdriver/chrome';

const uploadPath = './public/uploads/iiif/';
const editUrl = 'http://localhost:8080/edit/test/diva-test';

const browserNames = ['firefox', 'chrome'];
if (require('os').platform() === 'darwin') {
  browserNames.push('safari');
}

jest.setTimeout(15000);

beforeAll(() => {
  // Link test folder
  fs.copySync('./test/test', uploadPath + 'test');
});

afterAll(() => {
  fs.removeSync(uploadPath + 'test');
});

describe.each(['firefox', 'chrome', 'safari'])('Tests on %s', (title) => {
  let browser;

  beforeAll(async () => {
    const prefs = new Preferences();
    prefs.setLevel(Type.BROWSER, Level.ALL);

    browser = await new Builder()
      .forBrowser(title)
      .setFirefoxOptions(new firefox.Options().headless())
      .setChromeOptions(new chrome.Options().headless().windowSize({ width: 1280, height: 800 }))
      .setLoggingPrefs(prefs)
      .build();
    await browser.get(editUrl);
  });

  afterAll(done => {
    if (title === 'chrome') {
      browser.manage().logs().get(Type.BROWSER).then(entries => {
        entries.forEach(entry => {
          console.log(entry);
        });
      }).catch(err => {
        console.error(err);
      }).then(() => {
        browser.quit();
        done();
      });
    } else {
      browser.quit();
      done();
    }
  });

  describe('Neon Basics', () => {
    test('Render Page', async () => {
      const title = await browser.getTitle();
      expect(title).toBe('Neon');
    });
  });

  describe('Boundingbox selecting', () => {
    /*
    test('Select syl bbox', async () => {
      await browser.wait(until.elementLocated(By.id('displayBBox')), 10000);
      let displayButton = await browser.findElement(By.id('displayBBox'));
      // safari webdriver was not cooperating, so some things have to be done slightly differently in safari:
      if (title !== 'safari') {
        await browser.actions().click(displayButton).perform();
      } else {
        await browser.executeScript(() => { document.getElementById('displayBBox').click(); });
      }

      await browser.wait(until.elementLocated(By.id('edit_mode')), 10000);
      let editButton = await browser.findElement(By.id('edit_mode'));
      if (title !== 'safari') {
        await browser.actions().click(editButton).perform();
      } else {
        await browser.executeScript(() => { document.getElementById('edit_mode').click(); });
        await browser.executeScript(() => { document.getElementById('selByBBox').scrollIntoView(true); });
      }

      await browser.wait(until.elementLocated(By.id('selByBBox')), 10000);
      let selButton = await browser.findElement(By.id('selByBBox'));
      await browser.actions().click(selButton).perform();
      await browser.executeScript(() => { (document.getElementById('selByBBox')).dispatchEvent(new window.Event('mousedown')); });

      await browser.wait(until.elementLocated(By.className('sylTextRect-display')), 10000);
      await browser.executeScript(() => {
        console.log(document.getElementById('m-bc67f558-4736-49d0-bc71-8e05c72bc46e'));
        console.log(document.getElementById('m-bc67f558-4736-49d0-bc71-8e05c72bc46e').children[1]);
        (document.getElementById('m-bc67f558-4736-49d0-bc71-8e05c72bc46e').children[1]).dispatchEvent(new window.Event('mousedown'));
      });

      await browser.wait(until.elementLocated(By.id('resizeRect')), 10000);
      let resizeRectCount = (await browser.findElements(By.id('resizeRect'))).length;
      expect(resizeRectCount).toBe(1);
      let sylSelectedCount = (await browser.findElements(By.className('syl selected'))).length;
      expect(sylSelectedCount).toBe(1);

      await browser.actions().click(selButton).perform();
    });
    */
  });

  describe('Check Display Panel', () => {
    beforeAll(async () => {
      // Ensure document loaded
      await browser.wait(until.elementLocated(By.id('opacitySlider')), 10000);
    });

    test('Check Glyph Opacity', async () => {
      // Set opacity to 0
      await browser.executeScript(() => { document.getElementById('opacitySlider').scrollIntoView(true); });
      const glyphOpacitySlider = await browser.findElement(By.id('opacitySlider'));
      const rect = await glyphOpacitySlider.getRect();
      await browser.actions().dragAndDrop(glyphOpacitySlider, { x: -1 * Math.round(rect.width / 2), y: 0 }).perform();
      let opacityText = await browser.findElement(By.id('opacityOutput')).getText();
      expect(opacityText).toBe('0');
      await browser.wait(until.elementLocated(By.className('neon-container')), 10000);
      let containerStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(containerStyle).toContain('opacity: 0;');

      // Reset opacity to 1
      const opacityButton = await browser.findElement(By.id('reset-opacity'));
      await browser.actions().click(opacityButton).perform();
      opacityText = await browser.findElement(By.id('opacityOutput')).getText();
      containerStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(opacityText).toBe('100');
      expect(containerStyle).toContain('opacity: 1;');
    });

    test('Check Image Opacity', async () => {
      // Set opacity to 0
      const imageOpacitySlider = await browser.findElement(By.id('bgOpacitySlider'));
      const rect = await imageOpacitySlider.getRect();
      await browser.actions().dragAndDrop(imageOpacitySlider, { x: -1 * parseInt(rect.width), y: 0 }).perform();
      let opacityText = await browser.findElement(By.id('bgOpacityOutput')).getText();
      let canvasStyle = await browser.findElement(By.className('diva-viewer-canvas')).getAttribute('style');
      expect(opacityText).toBe('0');
      expect(canvasStyle).toContain('opacity: 0;');

      // Reset opacity to 1
      const opacityButton = await browser.findElement(By.id('reset-bg-opacity'));
      await browser.actions().click(opacityButton).perform();
      opacityText = await browser.findElement(By.id('bgOpacityOutput')).getText();
      canvasStyle = await browser.findElement(By.className('diva-viewer-canvas')).getAttribute('style');
      expect(opacityText).toBe('100');
      expect(canvasStyle).toContain('opacity: 1;');
    });

    test('Test Highlight (Syllable)', async () => {
      await browser.executeScript(() => { document.getElementById('highlight-button').click(); });
      await browser.executeScript(() => { document.getElementById('highlight-syllable').click(); });
      await browser.wait(until.elementLocated(By.className('syllable')), 10000);
      const someSyllable = await browser.findElement(By.className('syllable'));
      const syllableClasses = await someSyllable.getAttribute('class');
      expect(syllableClasses).toContain('highlighted');
    });
  });

  describe('Test diva.js viewer', () => {
    test('Test scrolling to new active page', async () => {
      // Verify that the first page is active.
      await browser.wait(until.elementLocated(By.id('neon-container-0')), 10000);
      const containerZero = await browser.findElement(By.id('neon-container-0'));
      const containerZeroClass = await containerZero.getAttribute('class');
      expect(containerZeroClass).toContain('active-page');

      // Change page and verify that active page changes
      // scroll
      await browser.executeScript(() => { document.getElementById('diva-1-viewport').scrollBy(0, 1000); });
      // Wait for load
      await browser.wait(until.elementLocated(By.id('neon-container-1')), 2000);
      const containerOneClass = await browser.findElement(By.id('neon-container-1')).getAttribute('class');
      expect(containerOneClass).toContain('active-page');
    });

    test('Test diva.js zoom', async () => {
      // Zoom in
      const zoomInButton = await browser.findElement(By.id('diva-1-zoom-in-button'));
      await browser.wait(until.elementLocated(By.className('neon-container')), 10000);
      const activeContainer = await browser.findElement(By.className('neon-container'));
      const initialSize = await activeContainer.getRect();
      await browser.actions().click(zoomInButton).perform();
      // wait until active container is visible
      await browser.wait(async () => {
        const style = await activeContainer.getAttribute('style');
        return style.match(/display: none;/);
      }, 1500);
      await browser.wait(async () => {
        const style = await activeContainer.getAttribute('style');
        return !style.match(/display: none;/);
      }, 1500);
      const zoomedSize = await activeContainer.getRect();
      await browser.sleep(3000);
      expect(zoomedSize.height).toBeGreaterThan(initialSize.height);
      expect(zoomedSize.width).toBeGreaterThan(initialSize.width);
    });
  });
});
