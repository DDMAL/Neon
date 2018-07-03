const fs = require("fs");
const verovio = require("verovio-dev");

import Neon from "../src/Neon.js";

const pathToMei = "./test/resources/test.mei";
var mei;

beforeAll(() => {
    mei = fs.readFileSync(pathToMei).toString();
});

test("Test 'getElementAttr' function", () => {
    let neon = new Neon(mei, new verovio.toolkit());
    neon.getSVG(); // for some reason verovio can't recognize the ids if this isn't done
    let atts = neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d");
    expect(atts["pname"]).toBe("a");
    expect(atts["oct"]).toBe("2");
});

test("Test dragging", () => {
    let neon = new Neon(mei, new verovio.toolkit());
    neon.getSVG();
    let originalAtts = neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d");
    let editorAction = {
        "action": "drag",
        "param": {
            "elementId": "m-54220197-ac7d-452c-8c34-b3d0bdbaefa0",
            "x": 2,
            "y": 69 
        }
    };
    neon.edit(editorAction);
    let newAtts = neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d");
    
    expect(originalAtts["pname"]).toBe("a");
    expect(originalAtts["oct"]).toBe("2");

    expect(newAtts["pname"]).toBe("c");
    expect(newAtts["oct"]).toBe("3");
});
