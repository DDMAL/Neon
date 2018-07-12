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

test("Test 'drag' action, neume", () => {
    let neon = new Neon(mei, new verovio.toolkit());
    neon.getSVG();
    let originalAtts = neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d");
    let editorAction = {
        "action": "drag",
        "param": {
            "elementId": "m-54220197-ac7d-452c-8c34-b3d0bdbaefa0",
            "x": 2,
            "y": 34 
        }
    };
    neon.edit(editorAction);
    let newAtts = neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d");
    
    expect(originalAtts["pname"]).toBe("a");
    expect(originalAtts["oct"]).toBe("2");

    expect(newAtts["pname"]).toBe("c");
    expect(newAtts["oct"]).toBe("3");
});

describe("Test insert editor action", () => {
    test("Test 'insert' action, punctum", () => {
        let neon = new Neon(mei, new verovio.toolkit());
        neon.getSVG();
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
        let insertAtts = neon.getElementAttr(neon.info());
        expect(insertAtts["pname"]).toBe("c");
        expect(insertAtts["oct"]).toBe("3");
    });

    test("Test 'insert' action, clef", () => {
        let neon = new Neon(mei, new verovio.toolkit());
        neon.getSVG();
        let editorAction = {
            "action": "insert",
            "param": {
                "elementType": "clef",
                "staffId": "auto",
                "ulx": 1033,
                "uly": 1431,
                "attributes": {
                    "shape": "C"
                }
            }
        };
        neon.edit(editorAction);
        let insertAtts = neon.getElementAttr(neon.info());
        expect(insertAtts["shape"]).toBe("C");
        expect(insertAtts["line"]).toBe("3");
    });

    test("Test 'insert' action, custos", () => {
        let neon = new Neon(mei, new verovio.toolkit());
        neon.getSVG();
        let editorAction = {
            "action": "insert",
            "param": {
                "elementType": "custos",
                "staffId": "auto",
                "ulx": 1476,
                "uly": 690
            }
        };
        neon.edit(editorAction);
        let insertAtts = neon.getElementAttr(neon.info());
        expect(insertAtts.pname).toBe("b");
        expect(insertAtts.oct).toBe("2");
    });
});

test("Test 'remove' action", () => {
    let neon = new Neon(mei, new verovio.toolkit());
    neon.getSVG();
    let editorAction = {
        "action": "remove",
        "param": {
            "elementId": "m-ceab54b1-893e-42de-8fca-aeeb13254e19"
        }
    };
    expect(neon.edit(editorAction)).toBeTruthy();
    let atts = neon.getElementAttr("m-ceab54b1-893e-42de-8fca-aeeb13254e19");
    expect(atts).toStrictEqual({});
});

test("Test undo and redo", () => {
    let neon = new Neon(mei, new verovio.toolkit());
    let firstSVG = neon.getSVG();
    //Should not be able to undo or redo now
    expect(neon.undo()).toBeFalsy();
    expect(neon.redo()).toBeFalsy();
    
    let editorAction = {
        "action": "drag",
        "param": {
            "elementId": "m-54220197-ac7d-452c-8c34-b3d0bdbaefa0",
            "x": 2,
            "y": 34 
        }
    };
    // Ensure the editor is working
    expect(neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d")).toEqual({pname: "a", oct: "2"});
    expect(neon.edit(editorAction)).toBeTruthy();
    expect(neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d")).toEqual({pname: "c", oct: "3"});

    expect(neon.undo()).toBeTruthy();
    neon.getSVG();
    expect(neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d")).toEqual({pname: "a", oct: "2"});
    expect(neon.redo()).toBeTruthy();
    neon.getSVG();
    expect(neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d")).toEqual({pname: "c", oct: "3"});
});

test("Test chain action", () => {
    let neon = new Neon(mei, new verovio.toolkit());
    neon.getSVG();
    let editorAction = {
        "action": "chain",
        "param": [
            {
                "action": "drag",
                "param": {
                    "elementId": "m-5ba56425-5c59-4f34-9e56-b86779cb4d6d",
                    "x": 2,
                    "y": 34 
                }
            },
            {
                "action": "insert",
                "param": {
                    "elementType": "nc",
                    "staffId": "auto",
                    "ulx": 939,
                    "uly": 2452
                }
            }
        ]
    };
    expect(neon.edit(editorAction)).toBeTruthy();
    let dragAtts = neon.getElementAttr("m-5ba56425-5c59-4f34-9e56-b86779cb4d6d");
    let insertAtts = neon.getElementAttr(JSON.parse(neon.info())[1]);
    expect(dragAtts.pname).toBe("c");
    expect(dragAtts.oct).toBe("3");
    expect(insertAtts.pname).toBe("c");
    expect(insertAtts.oct).toBe("3");
});
