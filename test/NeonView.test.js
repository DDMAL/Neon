/**
 * @jest-environment jest-environment-webdriver
 */
const pathToResources = "./test/resources/";
const pathToUploads = "./public/uploads/";
const editUrl = 'http://localhost:8080/edit/test.mei';
const fs = require("fs");

jest.setTimeout("10000");

beforeAll(() => {
    fs.linkSync(pathToResources + "test.png", pathToUploads + "png/test.png");
    fs.linkSync(pathToResources + "test.mei", pathToUploads + "mei/test.mei");
});

afterAll(() => {
    fs.unlinkSync(pathToUploads + "png/test.png");
    fs.unlinkSync(pathToUploads + "mei/test.mei");
});

describe("Neon2 View and Controls", () => {
    beforeEach(async () => {
        await browser.get(editUrl);
    });

    test("Render Page", async () => {
        const title = await browser.getTitle();
        expect(title).toBe("Neon2");
    });

    test("Check Zoom Slider", async () => {
        var zoomSlider = await browser.findElement(by.id('zoomSlider'));
        const actions = browser.actions();
        await actions.dragAndDrop(zoomSlider, {x: 180, y: 0}).perform();
        //await actions.move({origin: zoomSlider}).click().move({x: 1280}).release().perform();
        var svgGroup = await browser.findElement(by.id('svg_group'));
        var transform = await svgGroup.getAttribute("transform");
        expect(transform).toContain("scale(2)");
    });

    test("Check Zoom reset button", async () => {
        var zoomButton = await browser.findElement(by.id('reset-zoom'));
        const actions = browser.actions();
        await actions.click(zoomButton).perform();
        var svgGroup = await browser.findElement(by.id('svg_group'));
        console.log("svg group");
        var transform = await svgGroup.getAttribute("transform");
        expect(transform).toBe("translate(0,0) scale(1)");
    });
})
