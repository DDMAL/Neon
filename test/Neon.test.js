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

/**
 * Note that XML IDs may change on updates to verovio,
 * even with the xmlIdSeed set. If this happens, use
 * neon.getMEI() to check what the ID is. You may also
 * need to disable the --silent option for jest in
 * package.json.
 */
test("Test 'insert' action", () => {
    let toolkit = new verovio.toolkit();
    let neon = new Neon(mei, toolkit);
    let options = toolkit.getOptions();
    options.xmlIdSeed = 12345;
    toolkit.setOptions(options);
    neon.getSVG();
    let originalAtts = neon.getElementAttr("nc-0000000276628145");
    let editorAction = {
        "action": "insert",
        "param": {
            "elementType": "nc",
            "staffId": "auto",
            "ulx": 939,
            "uly": 2452
        }
    };
    neon.edit(editorAction);
    let insertAtts = neon.getElementAttr("nc-0000000276628145");
    expect(originalAtts).toStrictEqual({});
    expect(insertAtts["pname"]).toBe("c");
    expect(insertAtts["oct"]).toBe("3");
});
