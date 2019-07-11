/* eslint-env jest */
const pathToResources = './test/resources/';
const pathToUploads = './public/uploads/';
const editUrl = 'http://localhost:8080/edit/test.jsonld';

const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const error = require('selenium-webdriver/lib/error');
// const input = require('selenium-webdriver/lib/input');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');

jest.setTimeout('20000');

beforeAll(async () => {
  // Link test MEI/png to public/uploads so we can use them
  fs.linkSync(pathToResources + 'test.png', pathToUploads + 'img/test.png');
  fs.linkSync(pathToResources + 'test.mei', pathToUploads + 'mei/test.mei');
  fs.linkSync(pathToResources + 'test.jsonld', pathToUploads + 'manifests/test.jsonld');
});

afterAll(() => {
  // Clean up test files
  fs.unlinkSync(pathToUploads + 'img/test.png');
  fs.unlinkSync(pathToUploads + 'mei/test.mei');
  fs.unlinkSync(pathToUploads + 'manifests/test.jsonld');
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

  describe('Check Info Box', () => {
    test('Check Info Box Neumes', async () => {
      let neumeID = 'm-07ad2140-4fa1-45d4-af47-6733add00825';
      var message;
      await browser.wait(until.elementLocated(By.id(neumeID)), 10000); // Wait two seconds for elements to appear
      await browser.executeScript((neumeID) => { document.getElementById(neumeID).dispatchEvent(new window.Event('mouseover')); }, neumeID);
      let body = await browser.findElement(By.className('message-body'));
      await browser.wait(until.elementIsVisible(body), 5000);
      message = await body.getText();

      expect(message).toContain('Clivis');
      expect(message).toContain('A2 G2');
    });

    test('Check Info Box Clef', async () => {
      let clefId = 'm-45439068-5e0c-4595-a820-4faa16771422';
      await browser.wait(until.elementLocated(By.id(clefId)), 5000);
      await browser.executeScript((id) => { document.getElementById(id).dispatchEvent(new window.Event('mouseover')); }, clefId);
      var notification = await browser.findElement(By.className('message'));
      await browser.wait(until.elementTextMatches(notification, /clef/), 5000);
      var message = await browser.findElement(By.className('message-body')).getText();
      expect(message).toContain('Shape: C');
      expect(message).toContain('Line: 3');
    });

    test('Check Info Box Custos', async () => {
      let custosId = 'm-9e59174b-ed59-43a5-bba8-08e8eb276509';
      await browser.wait(until.elementLocated(By.id(custosId)), 2000);
      await browser.executeScript((id) => { document.getElementById(id).dispatchEvent(new window.Event('mouseover')); }, custosId);
      var message = await browser.findElement(By.className('message-body')).getText();
      expect(message).toContain('Pitch: G3');
    });
  });

  describe('Check Syl Bounding Box UI', () => {
    beforeAll(async () => {
      await browser.executeScript(() => { document.getElementById('edit_mode').click(); });
      await browser.executeScript(() => { document.getElementById('displayBBox').click(); });
      await browser.executeScript(() => { document.getElementById('selByBBox').click(); });
    });

    afterAll(async () => {
      await browser.executeScript(() => { document.getElementById('displayBBox').click(); });
    });

    test('Default BBox adding', async () => {
      let syls = (await browser.findElements(By.className('syl')));
      expect(syls.length).toBe(189);
      let bboxes = (await browser.findElements(By.className('sylTextRect-display')));
      expect(bboxes.length).toBe(188);
    });

    test('Click selecting BBox', async () => {
      await browser.executeScript(() => { document.getElementsByClassName('sylTextRect-display')[0].dispatchEvent(new window.Event('mousedown')); });
      let resizeRectCount = (await browser.findElements(By.id('resizeRect'))).length;
      expect(resizeRectCount).toBe(1);
      let sylSelectedCount = (await browser.findElements(By.className('syl selected'))).length;
      expect(sylSelectedCount).toBe(1);
      var canvas = await browser.findElement(By.id('svg_group'));
      const actions = browser.actions();
      await actions.move({ origin: canvas }).press().release().perform();
    });

    test('Drag selecting BBoxes', async () => {
      var canvas = await browser.findElement(By.id('svg_group'));
      const actions = browser.actions();
      await actions.move({ origin: canvas }).press().move({ x: 500, y: 500 }).perform();
      await browser.findElements(By.id('selectRect'));
      await actions.release().perform();
      let selected = await browser.findElements(By.css('g.syl.selected'));
      expect(selected.length).toBeGreaterThan(0);
      let resizeRects = await browser.findElements(By.id('resizeRect'));
      expect(resizeRects.length).toBe(0);
    });

    test('Syl BBox highlighting features', async () => {
      await browser.executeScript(() => { document.getElementById('highlight-button').dispatchEvent(new window.Event('click')); });
      await browser.executeScript(() => { document.getElementById('highlight-syllable').dispatchEvent(new window.Event('click')); });
      let colorCount = (await browser.findElements(By.css('.sylTextRect-display[style="fill: rgb(86, 180, 233);"]'))).length;
      expect(colorCount).toBeGreaterThan(0);

      await browser.executeScript(() => { document.getElementsByClassName('sylTextRect-display')[0].dispatchEvent(new window.Event('mousedown')); });
      let newColorCount = (await browser.findElements(By.css('.sylTextRect-display[style="fill: rgb(86, 180, 233);"]'))).length;
      expect(newColorCount).toBe(colorCount - 1);
      var canvas = await browser.findElement(By.id('svg_group'));
      const actions = browser.actions();
      await actions.move({ origin: canvas }).press().release().perform();
    });

    test('Test selecting neumes while in bbox selecting mode', async () => {
      await browser.executeScript(() => { document.getElementsByClassName('nc')[0].children[0].dispatchEvent(new window.Event('mousedown')); });
      let selCount = (await browser.findElements(By.className('selected'))).length;
      expect(selCount).toBe(0);
      var canvas = await browser.findElement(By.id('svg_group'));
      const actions = browser.actions();
      await actions.move({ origin: canvas }).press().move({ x: 500, y: 500 }).perform();
      await browser.findElements(By.id('selectRect'));
      await actions.release().perform();
      let goodSelCount = (await browser.findElements(By.className('selected'))).length;
      expect(goodSelCount).toBeGreaterThan(0);
      let badSelCount = (await browser.findElements(By.css('.selected:not(.syl)'))).length;
      expect(badSelCount).toBe(0);
      await actions.move({ origin: canvas }).press().release().perform();
    });
  });

  describe('Check Controls UI', () => {
    // Can't get viewBox from selenium for some reason so we can't check more than this
    test('Check Zoom Controls', async () => {
      var zoomSlider = await browser.findElement(By.id('zoomSlider'));
      var maxZoom = await zoomSlider.getAttribute('max');
      const actions = browser.actions();
      var rect = await zoomSlider.getRect();
      await actions.dragAndDrop(zoomSlider, { x: parseInt(rect.width / 2), y: 0 }).perform();
      var output = await browser.findElement(By.id('zoomOutput')).getText();
      expect(output).toBe(maxZoom);

      var zoomButton = await browser.findElement(By.id('reset-zoom'));
      await actions.click(zoomButton).perform();
      output = await browser.findElement(By.id('zoomOutput')).getText();
      expect(output).toBe('100');
    });

    test('Check Panning', async () => {
      var originalTransform = await browser.executeScript(() => { return document.getElementById('svg_group').getAttribute('viewBox'); });
      const actions = browser.actions();
      var svgGroup = await browser.findElement(By.id('svg_group'));
      await actions.keyDown(Key.SHIFT).dragAndDrop(svgGroup, { x: 50, y: 50 }).keyUp(Key.SHIFT).perform();
      var newTransform = await browser.executeScript(() => { return document.getElementById('svg_group').getAttribute('viewBox'); });

      var originalSplit = originalTransform.split(' ');
      var newSplit = newTransform.split(' ');
      expect(parseInt(originalSplit[0])).toBeGreaterThan(parseInt(newSplit[0]));
      expect(parseInt(originalSplit[1])).toBeGreaterThan(parseInt(newSplit[1]));
    });

    test('Check MEI Opacity Controls', async () => {
      var opacitySlider = await browser.findElement(By.id('opacitySlider'));
      const actions = browser.actions();
      var rect = await opacitySlider.getRect();
      await actions.dragAndDrop(opacitySlider, { x: -1 * parseInt(rect.width), y: 0 }).perform();
      var meiStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(meiStyle).toContain('opacity: 0;');

      var opacityButton = await browser.findElement(By.id('reset-opacity'));
      await actions.click(opacityButton).perform();
      meiStyle = await browser.findElement(By.className('neon-container')).getAttribute('style');
      expect(meiStyle).toContain('opacity: 1;');
    });

    test('Check Image Opacity Controls', async () => {
      var opacitySlider = await browser.findElement(By.id('bgOpacitySlider'));
      const actions = browser.actions();
      var rect = await opacitySlider.getRect();
      await actions.dragAndDrop(opacitySlider, { x: -1 * parseInt(rect.width), y: 0 }).perform();
      var imgStyle = await browser.findElement(By.id('bgimg')).getAttribute('style');
      expect(imgStyle).toContain('opacity: 0;');

      var opacityButton = await browser.findElement(By.id('reset-bg-opacity'));
      await actions.click(opacityButton).perform();
      imgStyle = await browser.findElement(By.id('bgimg')).getAttribute('style');
      expect(imgStyle).toContain('opacity: 1;');
    });

    /* test('Check Text Controls', async () => {
      var syl = await browser.findElement(By.id('syl_text')).getAttribute('style');
      expect(syl).toContain('display: none;');
      var textCheck = await browser.findElement(By.id('displayText'));
      const actions = browser.actions();
      await actions.click(textCheck).perform();
      syl = await browser.findElement(By.id('syl_text')).getAttribute('style');
      expect(syl).not.toContain('display: none;');
    }); */

    /// TEST EDIT MODE ///
    describe('Edit Mode', () => {
      describe('Selection', () => {
        test('Test drag selection', async () => {
          var canvas = await browser.findElement(By.id('svg_group'));
          const actions = browser.actions();
          await actions.move({ origin: canvas }).press().move({ x: 200, y: 200 }).perform();
          await browser.findElement(By.id('selectRect'));
          await actions.release().perform();
          await browser.findElement(By.className('selected'));
          let selected = await browser.findElements(By.className('selected'));
          expect(selected.length).toBeGreaterThan(0);
        });

        test('Test click select .nc', async () => {
          var selByNcButton = await browser.findElement(By.id('selByNc'));
          await browser.executeScript(() => { document.getElementById('selByNc').scrollIntoView(true); });
          const actions = browser.actions();
          await actions.click(selByNcButton).perform();
          var nc = await browser.findElement(By.className('nc'));
          await browser.executeScript((id) => { document.getElementById(id).children[0].dispatchEvent(new window.Event('mousedown')); }, (await nc.getAttribute('id')));
          var ncClass = await nc.getAttribute('class');
          expect(ncClass).toBe('nc selected');
          await actions.click().perform();
        });

        test('Click select syllable', async () => {
          var selBySylButton = await browser.findElement(By.id('selBySyl'));
          const actions = browser.actions();
          await actions.click(selBySylButton).perform();
          expect(await selBySylButton.getAttribute('class')).toContain('is-active');
          var syl = await browser.findElement(By.id('m-9eea945f-9acf-4f85-9dee-ce24fde486f1'));
          var sylNc = await syl.findElement(By.className('nc'));
          // await actions.click(sylNc).perform();
          await browser.executeScript((id) => { document.getElementById(id).children[0].dispatchEvent(new window.Event('mousedown')); }, (await sylNc.getAttribute('id')));
          let sylClass = await syl.getAttribute('class');
          expect(sylClass).toBe('syllable selected');
          await actions.click().perform();
        });

        test('Click select split syllable', async () => {
          var selBySylButton = await browser.findElement(By.id('selBySyl'));
          const actions = browser.actions();
          await actions.click(selBySylButton).perform();
          expect(await selBySylButton.getAttribute('class')).toContain('is-active');
          var firstHalf = await browser.findElement(By.id('m-eefa04b9-e43e-41a9-8d63-d5b093834442'));
          var secondHalf = await browser.findElement(By.id('m-23a8ef14-9b60-47dd-b072-fa2b6bc2e8bd'));
          var firstHalfNc = await firstHalf.findElement(By.className('nc'));
          await browser.executeScript((id) => { document.getElementById(id).children[0].dispatchEvent(new window.Event('mousedown')); }, (await firstHalfNc.getAttribute('id')));
          let firstHalfClass = await firstHalf.getAttribute('class');
          let secondHalfClass = await secondHalf.getAttribute('class');
          expect(firstHalfClass).toBe('syllable selected');
          expect(secondHalfClass).toBe('syllable selected');
          await actions.click().perform();
        });

        test('Click select neume', async () => {
          var selByNeumeButton = await browser.findElement(By.id('selByNeume'));
          const actions = browser.actions();
          await actions.click(selByNeumeButton).perform();
          expect(await selByNeumeButton.getAttribute('class')).toContain('is-active');
          var neume = await browser.findElement(By.className('neume'));
          var neumeNc = await neume.findElement(By.className('nc'));
          // await actions.click(neumeNc).perform();
          await browser.executeScript((id) => { document.getElementById(id).children[0].dispatchEvent(new window.Event('mousedown')); }, (await neumeNc.getAttribute('id')));
          let neumeClass = await neume.getAttribute('class');
          expect(neumeClass).toBe('neume selected');
          await actions.click().perform();
        });

        test('Click select staff', async () => {
          var selByStaff = await browser.findElement(By.id('selByStaff'));
          const actions = browser.actions();
          expect(await selByStaff.isDisplayed()).toBeTruthy();
          await browser.executeScript(() => { document.getElementById('selByStaff').scrollIntoView(true); });
          await actions.click(selByStaff).perform();
          expect(await selByStaff.getAttribute('class')).toContain('is-active');
          var staff = await browser.findElement(By.className('staff'));
          var nc = await staff.findElement(By.className('nc'));
          await browser.executeScript((id) => { document.getElementById(id).children[0].dispatchEvent(new window.Event('mousedown')); }, await nc.getAttribute('id'));
          let staffClass = await staff.getAttribute('class');
          expect(staffClass).toBe('staff selected');
          await actions.click().perform();
        });
      });

      test('Delete element', async () => {
        expect.assertions(1);
        let selBySylButton = await browser.findElement(By.id('selBySyl'));
        const actions = browser.actions();
        await actions.click(selBySylButton).perform();
        let syl = await browser.findElement(By.className('syllable'));
        let sylNc = await syl.findElement(By.className('nc'));
        let id = await sylNc.getAttribute('id');
        await browser.executeScript((id) => { document.getElementById(id).children[0].dispatchEvent(new window.Event('mousedown')); }, id);
        let deleteButton = await browser.findElement(By.id('delete'));
        await actions.click(deleteButton).perform();
        await browser.wait(until.stalenessOf(syl), 1000);
        return expect(browser.findElement(By.id(id))).rejects.toThrowError(error.NoSuchElementError);
      });

      test('Undo/Redo', async () => {
        let undoButton = await browser.findElement(By.id('undo'));
        const actions = browser.actions();
        let element = await browser.findElement(By.className('nc'));
        let origCount = (await browser.findElements(By.className('nc'))).length;
        await actions.click(undoButton).perform();
        await browser.wait(until.stalenessOf(element), 5000);
        let newCount = (await browser.findElements(By.className('nc'))).length;
        expect(newCount).toBeGreaterThan(origCount);
        element = browser.findElement(By.className('nc'));
        // await actions.click(redoButton).perform();
        await browser.executeScript(() => { document.getElementById('redo').dispatchEvent(new window.Event('click')); });
        await browser.wait(until.stalenessOf(element), 5000);
        newCount = (await browser.findElements(By.className('nc'))).length;
        expect(newCount).toEqual(origCount);
      });

      describe('Insert Test', () => {
        // Doesn't test location of insert, only that the handler works.
        test('Insert Punctum', async () => {
          let insertPunctum = await browser.findElement(By.id('punctum'));
          let ncCount = (await browser.findElements(By.className('nc'))).length;
          let someNc = await browser.findElement(By.className('nc'));
          await browser.executeScript((id) => { document.getElementById(id).scrollIntoView(true); }, (await someNc.getAttribute('id')));
          let isDisp = await insertPunctum.isDisplayed();
          expect(isDisp).toEqual(true);
          await insertPunctum.click();
          let clickedInsertPunctum = await browser.findElement(By.id('punctum'));
          let buttonClass = await clickedInsertPunctum.getAttribute('class');
          expect(buttonClass).toContain('is-active');
          // await browser.actions().move({ origin: someNc, x: 100, y: 100 }).click().perform();
          await browser.executeScript(() => { document.getElementById('svg_group').dispatchEvent(new window.MouseEvent('click', { bubbles: true })); });
          await browser.wait(until.stalenessOf(someNc), 5000);
          let newNcCount = (await browser.findElements(By.className('nc'))).length;
          expect(newNcCount).toBe(ncCount + 1);
        });

        test('Insert Pes', async () => {
          await browser.executeScript(() => { document.getElementById('groupingTab').dispatchEvent(new window.Event('click')); });
          let pesButton = await browser.findElement(By.id('pes'));
          await pesButton.click();
          // Get initial neume and nc counts
          let neumeCount = (await browser.findElements(By.className('neume'))).length;
          let ncCount = (await browser.findElements(By.className('nc'))).length;
          // Check that insert panel heading title is selected (check if bold)
          let insertHeader = await browser.findElement(By.id('insertMenu'));
          expect(await insertHeader.getCssValue('font-weight')).toMatch(/(700|bold)/);
          // Move mouse and click
          await browser.executeScript(() => { document.getElementById('svg_group').dispatchEvent(new window.MouseEvent('click', { bubbles: true })); });
          // Get new counts
          await browser.wait(async () => {
            let count = (await browser.findElements(By.className('neume'))).length;
            return count === neumeCount + 1;
          }, 2000);
          let newNcCount = (await browser.findElements(By.className('nc'))).length;
          // Compare
          expect(newNcCount).toBe(ncCount + 2);
        });
      });
    });
  });
});
