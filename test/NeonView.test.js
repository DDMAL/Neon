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
});

describe("Neon2 Basics", () => {
    test("Render Page", async () => {
        const title = await browser.getTitle();
        expect(title).toBe("Neon2");
    });
});

describe("Check Controls UI", () => {
    test("Check Zoom Controls", async () => {
        var zoomSlider = await browser.findElement(By.id('zoomSlider'));
        const actions = browser.actions();
        await actions.dragAndDrop(zoomSlider, {x: 180, y: 0}).perform();
        var transform = await browser.findElement(By.id("svg_group")).getAttribute("transform");
        expect(transform).toContain("scale(2)");
        
        var zoomButton = await browser.findElement(By.id('reset-zoom'));
        await actions.click(zoomButton).perform();
        var transform = await browser.findElement(By.id("svg_group")).getAttribute("transform");
        expect(transform).toBe("translate(0,0) scale(1)");
    });

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
    
    test("Check MEI Opacity Controls", async () => {
        var opacitySlider = await browser.findElement(By.id("opacitySlider"));
        const actions = browser.actions();
        await actions.dragAndDrop(opacitySlider, {x: -188, y: 0}).perform();
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
        await actions.dragAndDrop(opacitySlider, {x: -195, y: 0}).perform();
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
