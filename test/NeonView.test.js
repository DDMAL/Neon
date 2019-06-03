/* eslint-env jest */
const pathToResources = './test/resources/';
const pathToUploads = './public/uploads/';
const editUrl = 'http://localhost:8080/edit/test.mei';

const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const error = require('selenium-webdriver/lib/error');
// const input = require('selenium-webdriver/lib/input');
const firefox = require('selenium-webdriver/firefox');

var browser = null;

jest.setTimeout('15000');

beforeAll(async () => {
  // Link test MEI/png to public/uploads so we can use them
  fs.linkSync(pathToResources + 'test.png', pathToUploads + 'png/test.png');
  fs.linkSync(pathToResources + 'test.mei', pathToUploads + 'mei/test.mei');

  // Set up the webdriver
  let options = new firefox.Options()
    .headless();
  browser = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

  await browser.get(editUrl);
});

afterAll(() => {
  // Clean up test files
  fs.unlinkSync(pathToUploads + 'png/test.png');
  fs.unlinkSync(pathToUploads + 'mei/test.mei');
  try {
    fs.unlinkSync(pathToUploads + 'mei-auto/test.mei');
  } catch (err) { // this is just to clean up so we don't care if it fails
  }
  if (browser !== null) {
    browser.quit();
  }
});

describe('Neon3 Basics', () => {
  test('Render Page', async () => {
    const title = await browser.getTitle();
    expect(title).toBe('Neon3');
  });
});

describe('Check Info Box', () => {
  test('Check Info Box Neumes', async () => {
    let neumeID = 'm-07ad2140-4fa1-45d4-af47-6733add00825';
    await browser.wait(until.elementLocated(By.id(neumeID)), 2000); // Wait two seconds for elements to appear
    await browser.executeScript((neumeID) => { document.getElementById(neumeID).dispatchEvent(new window.Event('mouseover')); }, neumeID);
    var message = await browser.findElement(By.className('message-body')).getText();

    expect(message).toContain('Clivis');
    expect(message).toContain('A2 G2');
  });

  test('Check Info Box Clef', async () => {
    let clefId = 'm-45439068-5e0c-4595-a820-4faa16771422';
    await browser.wait(until.elementLocated(By.id(clefId)), 2000);
    await browser.executeScript((id) => { document.getElementById(id).dispatchEvent(new window.Event('mouseover')); }, clefId);
    var notification = await browser.findElement(By.className('message'));
    await browser.wait(until.elementIsVisible(notification));
    var message = await browser.findElement(By.className('message')).getText();
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
    await actions.keyDown(Key.SHIFT).dragAndDrop(svgGroup, { x: 100, y: 100 }).keyUp(Key.SHIFT).perform();
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
    beforeAll(async () => {
      var editBtn = await browser.findElement(By.linkText('Edit MEI'));
      const actions = browser.actions();
      await actions.click(editBtn).perform();
    });

    describe('Selection', () => {
      test('Test drag selection', async () => {
        var canvas = await browser.findElement(By.id('mei_output'));
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
        await browser.executeScript("document.getElementById('selByStaff').scrollIntoView(true);");
        await actions.click(selByStaff).perform();
        expect(await selByStaff.getAttribute('class')).toContain('is-active');
        var staff = await browser.findElement(By.className('staff'));
        var nc = await staff.findElement(By.className('nc'));
        await actions.click(nc).perform();
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
      return expect(browser.findElement(By.id(id))).rejects.toThrowError(error.NoSuchElementError);
    });

    test('Undo/Redo', async () => {
      let undoButton = await browser.findElement(By.id('undo'));
      const actions = browser.actions();
      let origCount = (await browser.findElements(By.className('nc'))).length;
      await actions.click(undoButton).perform();
      let newCount = (await browser.findElements(By.className('nc'))).length;
      expect(newCount).toBeGreaterThan(origCount);
      // await actions.click(redoButton).perform();
      await browser.executeScript(() => { document.getElementById('redo').dispatchEvent(new window.Event('click')); });
      newCount = (await browser.findElements(By.className('nc'))).length;
      expect(newCount).toEqual(origCount);
    });

    describe('Insert Test', () => {
      // Doesn't test location of insert, only that the handler works.
      test('Insert Punctum', async () => {
        let insertPunctum = await browser.findElement(By.id('punctum'));
        const actions = browser.actions();
        let ncCount = (await browser.findElements(By.className('nc'))).length;
        let someNc = await browser.findElement(By.className('nc'));
        await browser.executeScript((id) => { document.getElementById(id).scrollIntoView(true); }, (await someNc.getAttribute('id')));
        let isDisp = await insertPunctum.isDisplayed();
        expect(isDisp).toEqual(true);
        await insertPunctum.click();
        let clickedInsertPunctum = await browser.findElement(By.id('punctum'));
        let buttonClass = await clickedInsertPunctum.getAttribute('class');
        expect(buttonClass).toContain('is-active');
        await actions.move({ origin: someNc, x: 100, y: 100 }).click().perform();
        let newNcCount = (await browser.findElements(By.className('nc'))).length;
        expect(newNcCount).toBe(ncCount + 1);
      });

      test('Insert Pes', async () => {
        let groupingTab = await browser.findElement(By.id('groupingTab'));
        const actions = browser.actions();
        await actions.click(groupingTab).perform();
        let pesButton = await browser.findElement(By.id('pes'));
        await pesButton.click();
        // Get initial neume and nc counts
        let neumeCount = (await browser.findElements(By.className('neume'))).length;
        let ncCount = (await browser.findElements(By.className('nc'))).length;
        // Check that insert panel heading title is selected (check if bold)
        let insertHeader = await browser.findElement(By.id('insertMenu'));
        expect(await insertHeader.getCssValue('font-weight')).toBe('700');

        // Move mouse and click
        let bg = await browser.findElement(By.id('bgimg'));
        // await actions.move({ origin: bg, x: 200, y: 300 }).click().perform();
        await bg.click();
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
