const pathToResources = "./test/resources/";
const pathToUploads = "./public/uploads/";
const editUrl = 'http://localhost:8080/edit/test.mei';

const fs = require("fs");
const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

var browser = null;

jest.setTimeout("10000");

beforeAll(async () => {
    // Link test MEI/png to public/uploads so we can use them
    fs.linkSync(pathToResources + "test.png", pathToUploads + "png/test.png");
    fs.linkSync(pathToResources + "test.mei", pathToUploads + "mei/test.mei");
    
    // Set up the webdriver
    let options = new firefox.Options()
        .headless();
    browser = await new Builder().
        forBrowser('firefox').
        setFirefoxOptions(options).
        build();

    await browser.get(editUrl);
});

afterAll(() => {
    // Clean up test files
    fs.unlinkSync(pathToUploads + "png/test.png");
    fs.unlinkSync(pathToUploads + "mei/test.mei");
    if (browser !== null) {
        browser.quit();
    }
});

describe("Neon2 Basics", () => {
    test("Render Page", async () => {
        const title = await browser.getTitle();
        expect(title).toBe("Neon2");
    });
});

describe("Check Info Box", () => {
    test("Check Info Box Neumes", async () => {
        var neumeClivis = await browser.findElement(By.id("m-07ad2140-4fa1-45d4-af47-6733add00825"));
        const actions = browser.actions();
        await actions.click(neumeClivis).perform();
        var message = await browser.findElement(By.className("message-body")).getText();
        expect(message).toContain("Clivis");
        expect(message).toContain("A2 G2");
    });

    test("Check Info Box Clef", async () => {
        var firstClef = await browser.findElement(By.id("m-5336ecdd-16ac-4d06-ac93-0d83b7458cea"));
        const actions = browser.actions();
        // Can't click center since the clef is open there
        var rect = await firstClef.getRect();
        await actions.move({origin: firstClef, y: parseInt(rect.height / 2)}).click().perform();
        var message = await browser.findElement(By.className("message-body")).getText();
        expect(message).toContain("Shape: C");
        expect(message).toContain("Line: 3");
    });

    test("Check Info Box Custos", async () => {
        var firstCustos = await browser.findElement(By.id("m-9e59174b-ed59-43a5-bba8-08e8eb276509"));
        const actions = browser.actions();
        // Can't click center since actual custos glyph is to the left
        var rect = await firstCustos.getRect();
        await actions.move({origin: firstCustos, x: -1 * parseInt(rect.width / 2)}).click().perform();
        var message = await browser.findElement(By.className("message-body")).getText();
        expect(message).toBe("Pitch: G3");
    });
});

describe("Check Controls UI", () => {
    // Can't get viewBox from selenium for some reason so we can't check more than this
    test("Check Zoom Controls", async () => {
        var zoomSlider = await browser.findElement(By.id('zoomSlider'));
        var maxZoom = await zoomSlider.getAttribute("max");
        const actions = browser.actions();
        var rect = await zoomSlider.getRect();
        await actions.dragAndDrop(zoomSlider, {x: parseInt(rect.width / 2), y: 0}).perform();
        var output = await browser.findElement(By.id('zoomOutput')).getText();
        expect(output).toBe(maxZoom);

        var zoomButton = await browser.findElement(By.id('reset-zoom'));
        await actions.click(zoomButton).perform();
        output = await browser.findElement(By.id('zoomOutput')).getText();
        expect(output).toBe("100");
    });

    /*
     * For some reason selenium can't find the viewBox attribute and always returns null
     * so there's nothing to check with panning

    test("Check Panning", async () => {
        var originalTransform = await browser.findElement(By.id("svg_group")).getAttribute("transform");
        const actions = browser.actions();
        var svgGroup = await browser.findElement(By.id("svg_group"));
        await actions.keyDown(Key.SHIFT).dragAndDrop(svgGroup, {x: 100, y: 100}).keyUp(Key.SHIFT).perform();
        var newTransform = await browser.findElement(By.id("svg_group")).getAttribute("transform");

        var originalSplit = originalTransform.slice(10, -10).split(",");
        var newSplit = newTransform.slice(10, -10).split(",");
        expect(parseInt(originalSplit[0])).toBeLessThan(parseInt(newSplit[0]));
        expect(parseInt(originalSplit[1])).toBeLessThan(parseInt(newSplit[1]));
    });
    */
    
    test("Check MEI Opacity Controls", async () => {
        var opacitySlider = await browser.findElement(By.id("opacitySlider"));
        const actions = browser.actions();
        var rect = await opacitySlider.getRect();
        await actions.dragAndDrop(opacitySlider, {x: -1 * parseInt(rect.width), y: 0}).perform();
        var meiStyle = await browser.findElement(By.className("definition-scale")).getAttribute("style");
        expect(meiStyle).toContain("opacity: 0;");
        
        var opacityButton = await browser.findElement(By.id("reset-opacity"));
        await actions.click(opacityButton).perform();
        var meiStyle = await browser.findElement(By.className("definition-scale")).getAttribute("style");
        expect(meiStyle).toContain("opacity: 1;");
    });
    
    test("Check Image Opacity Controls", async () => {
        var opacitySlider = await browser.findElement(By.id("bgOpacitySlider"));
        const actions = browser.actions();
        var rect = await opacitySlider.getRect();
        await actions.dragAndDrop(opacitySlider, {x: -1 * parseInt(rect.width), y: 0}).perform();
        var imgStyle = await browser.findElement(By.id("bgimg")).getAttribute("style");
        expect(imgStyle).toContain("opacity: 0;");
        
        var opacityButton = await browser.findElement(By.id("reset-bg-opacity"));
        await actions.click(opacityButton).perform();
        var imgStyle = await browser.findElement(By.id("bgimg")).getAttribute("style");
        expect(imgStyle).toContain("opacity: 1;");
    });

    test("Check Text Controls", async () => {
        var syl = await browser.findElement(By.className("syl")).getAttribute("style");
        expect(syl).toContain("visibility: hidden;");
        var textCheck = await browser.findElement(By.id("displayText"));
        const actions = browser.actions();
        await actions.click(textCheck).perform();
        syl = await browser.findElement(By.className("syl")).getAttribute("style");
        expect(syl).toContain("visibility: visible;");
    });
});
