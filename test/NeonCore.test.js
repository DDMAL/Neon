/* eslint-env jest */
import NeonCore from '../src/NeonCore.js';

const fs = require('fs');
const verovio = require('verovio-dev');

const pathToMei = './test/resources/test.mei';
var mei, DOMParser, parser;

beforeAll(() => {
  mei = fs.readFileSync(pathToMei).toString();
  // DOMParser = new jsdom.JSDOM().window.DOMParser;
  parser = new window.DOMParser();
  mei = new Map();
  mei.set(0, fs.readFileSync(pathToMei).toString());
});

test("Test 'SetText' function", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  let svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
  let syl = svg.querySelector('#test syl :)').textContent.trim();
  expect(syl).toBe('Hello');
  let editorAction = {
    'action': 'setText',
    'param': {
      'elementId': 'm-f715514e-cb0c-48e4-a1f9-a265ec1d5ca1',
      'text': 'asdf'
    }
  };
  expect(await neon.edit(editorAction, 0)).toBeTruthy();
  svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
  syl = svg.querySelector('#test syl :)').textContent.trim();
  expect(syl).toBe('asdf');
});

afterAll(async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.db.destroy();
});

test("Test 'getElementAttr' function", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(0); // for some reason verovio can't recognize the ids if this isn't done
  let atts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0);
  expect(atts['pname']).toBe('a');
  expect(atts['oct']).toBe('2');
});

test("Test 'drag' action, neume", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(0);
  let originalAtts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0);
  let editorAction = {
    'action': 'drag',
    'param': {
      'elementId': 'm-54220197-ac7d-452c-8c34-b3d0bdbaefa0',
      'x': 2,
      'y': 34
    }
  };
  await neon.edit(editorAction, 0);
  let newAtts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0);

  expect(originalAtts['pname']).toBe('a');
  expect(originalAtts['oct']).toBe('2');

  expect(newAtts['pname']).toBe('b');
  expect(newAtts['oct']).toBe('2');
});

describe('Test insert editor action', () => {
  test("Test 'insert' action, punctum", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'nc',
        'staffId': 'auto',
        'ulx': 939,
        'uly': 2452
      }
    };
    await neon.edit(editorAction, 0);
    let insertAtts = await neon.getElementAttr(await neon.info(0), 0);
    expect(insertAtts['pname']).toBe('e');
    expect(insertAtts['oct']).toBe('3');
  });

  test("Test 'insert' action, clef", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'clef',
        'staffId': 'auto',
        'ulx': 1033,
        'uly': 1431,
        'attributes': {
          'shape': 'C'
        }
      }
    };
    await neon.edit(editorAction, 0);
    let insertAtts = await neon.getElementAttr(await neon.info(0), 0);
    expect(insertAtts['shape']).toBe('C');
    expect(insertAtts['line']).toBe('3');
  });

  test("Test 'insert' action, custos", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'custos',
        'staffId': 'auto',
        'ulx': 1476,
        'uly': 690
      }
    };
    await neon.edit(editorAction, 0);
    let insertAtts = await neon.getElementAttr(await neon.info(0), 0);
    expect(insertAtts.pname).toBe('g');
    expect(insertAtts.oct).toBe('2');
  });
  test("Test 'insert' action, nc", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'nc',
        'staffId': 'auto',
        'ulx': 1337,
        'uly': 655
      }
    };
    await neon.edit(editorAction, 0);
    let insertAtts = await neon.getElementAttr(await neon.info(0), 0);
    expect(insertAtts.pname).toBe('a');
    expect(insertAtts.oct).toBe('2');
  });
});

describe("Test 'group and ungroup' functions", () => {
  test("Test 'group/ungroup' functions, nc, syllable", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);
    // group
    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction, 0)).toBeTruthy();
    let editorAction2 = {
      'action': 'group',
      'param': {
        'groupType': 'nc',
        'elementIds': ['m-ceab54b1-893e-42de-8fca-aeeb13254e19', 'm-2cf5243a-7042-42f9-b0c0-fd65f3ed67e0']
      }
    };
    expect(await neon.edit(editorAction2, 0)).toBeTruthy();

    // ungroup
    let editorAction3 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'nc',
        'elementIds': ['m-ceab54b1-893e-42de-8fca-aeeb13254e19', 'm-2cf5243a-7042-42f9-b0c0-fd65f3ed67e0']
      }
    };
    expect(await neon.edit(editorAction3, 0)).toBeTruthy();
    let editorAction4 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction4, 0)).toBeTruthy();
  });

  test("Test 'group/ungroup' functions, neume with multiple fullParents", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);

    // group
    let editorAction = {
      'action': 'setText',
      'param': {
        'elementId': 'm-ef58ea53-8d3a-4e9b-9b82-b9a057fe3fe4',
        'text': 'world!'
      }
    };
    expect(await neon.edit(editorAction, 0)).toBeTruthy();
    let editorAction2 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction2, 0)).toBeTruthy();
    let info = await neon.info(0);
    let svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    // svg is doing weird stuff with whitespace so I'm removing all of it before compairing
    let syl = svg.querySelector('#' + info).textContent.trim();
    expect(syl).toBe('Helloworld!');

    // ungroup
    let editorAction3 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction3, 0)).toBeTruthy();
    let info2 = await neon.info(0);
    svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    let array = info2.split(' ');
    syl = svg.querySelector('#' + array[0]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('Helloworld!');
    syl = svg.querySelector('#' + array[1]).textContent.trim();
    expect(syl).toBe('');
  });

  test("Test 'group/ungroup' functions, neueme with one fullParent", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);
    let setupGroup = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(setupGroup, 0)).toBeTruthy();
    let firstGroup = await neon.info(0);
    console.log(firstGroup);
    let svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    let syl = svg.querySelector('#' + firstGroup).textContent.trim();
    expect(syl).toBe('Hello');
    let setupSetText = {
      'action': 'setText',
      'param': {
        'elementId': 'm-4450b0db-733d-459c-afad-e050eab0af63',
        'text': 'world!'
      }
    };

    expect(await neon.edit(setupSetText, 0)).toBeTruthy();
    svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    syl = svg.querySelector('#m-4450b0db-733d-459c-afad-e050eab0af63').textContent.trim();
    expect(syl).toBe('world!');

    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-4475cbc8-ad26-44ee-999b-d18ce43600ab', 'm-07ad2140-4fa1-45d4-af47-6733add00825']
      }
    };
    expect(await neon.edit(editorAction, 0)).toBeTruthy();
    let info = await neon.info(0);
    svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    syl = svg.querySelector('#' + info).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world!');
    syl = svg.querySelector('#' + firstGroup).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('Hello');

    let ungroupAction = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-4475cbc8-ad26-44ee-999b-d18ce43600ab', 'm-07ad2140-4fa1-45d4-af47-6733add00825']
      }
    };
    expect(await neon.edit(ungroupAction, 0)).toBeTruthy();
    let ungroupInfo = await neon.info(0);
    let array = ungroupInfo.split(' ');
    svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    syl = svg.querySelector('#' + array[0]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world!');
    syl = svg.querySelector('#' + array[1]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe(' ');
  });

  test("Test 'group/ungroup' functions, neume with no fullParents", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(0);
    let svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    let setupGroup1 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(setupGroup1, 0)).toBeTruthy();
    let firstSyl = await neon.info(0);
    let setupName1 = {
      'action': 'setText',
      'param': {
        'elementId': firstSyl,
        'text': 'hello1'
      }
    };
    expect(await neon.edit(setupName1, 0)).toBeTruthy();
    svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    let syl = svg.querySelector('#' + firstSyl).textContent.trim();
    expect(syl).toBe('hello1');
    let setupGroup2 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-07ad2140-4fa1-45d4-af47-6733add00825', 'm-2292df83-f3ad-400e-8fc3-4b69b241a30f']
      }
    };
    expect(await neon.edit(setupGroup2, 0)).toBeTruthy();
    let secondSyl = await neon.info(0);
    let setupName2 = {
      'action': 'setText',
      'param': {
        'elementId': secondSyl,
        'text': 'hello2'
      }
    };
    expect(await neon.edit(setupName2, 0)).toBeTruthy();
    svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    syl = svg.querySelector('#' + secondSyl).textContent.trim();
    expect(syl).toBe('hello2');

    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-4475cbc8-ad26-44ee-999b-d18ce43600ab', 'm-07ad2140-4fa1-45d4-af47-6733add00825']
      }
    };
    expect(await neon.edit(editorAction, 0)).toBeTruthy();
    let mergedSyl = await neon.info(0);
    svg = parser.parseFromString(await neon.getSVG(0), 'image/svg+xml').documentElement;
    syl = svg.querySelector('#' + mergedSyl).textContent.trim();
    expect(syl).toBe('');

    syl = svg.querySelector('#' + firstSyl).textContent.trim();
    expect(syl).toBe('hello1');

    syl = svg.querySelector('#' + secondSyl).textContent.trim();
    expect(syl).toBe('hello2');
  });
});

test("Test 'remove' action", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(0);
  let editorAction = {
    'action': 'remove',
    'param': {
      'elementId': 'm-ceab54b1-893e-42de-8fca-aeeb13254e19'
    }
  };
  expect(await neon.edit(editorAction, 0)).toBeTruthy();
  let atts = await neon.getElementAttr('m-ceab54b1-893e-42de-8fca-aeeb13254e19', 0);
  expect(atts).toStrictEqual({});
});

test('Test undo and redo', async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(0);
  // Should not be able to undo or redo now
  expect(await neon.undo(0)).toBeFalsy();
  expect(await neon.redo(0)).toBeFalsy();

  let editorAction = {
    'action': 'drag',
    'param': {
      'elementId': 'm-54220197-ac7d-452c-8c34-b3d0bdbaefa0',
      'x': 2,
      'y': 34
    }
  };
    // Ensure the editor is working
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0)).toEqual({ pname: 'a', oct: '2' });
  expect(await neon.edit(editorAction, 0)).toBeTruthy();
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0)).toEqual({ pname: 'b', oct: '2' });

  expect(await neon.undo(0)).toBeTruthy();
  await neon.getSVG(0);
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0)).toEqual({ pname: 'a', oct: '2' });
  expect(await neon.redo(0)).toBeTruthy();
  await neon.getSVG(0);
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0)).toEqual({ pname: 'b', oct: '2' });
});

test('Test chain action', async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(0);
  let editorAction = {
    'action': 'chain',
    'param': [
      {
        'action': 'drag',
        'param': {
          'elementId': 'm-5ba56425-5c59-4f34-9e56-b86779cb4d6d',
          'x': 2,
          'y': 34
        }
      },
      {
        'action': 'insert',
        'param': {
          'elementType': 'nc',
          'staffId': 'auto',
          'ulx': 939,
          'uly': 2452
        }
      }
    ]
  };
  expect(await neon.edit(editorAction, 0)).toBeTruthy();
  console.log('Hello');
  let dragAtts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', 0);
  let insertAtts = await neon.getElementAttr(JSON.parse(neon.info(0))[1], 0);
  expect(dragAtts.pname).toBe('b');
  expect(dragAtts.oct).toBe('2');
  expect(insertAtts.pname).toBe('e');
  expect(insertAtts.oct).toBe('3');
});

test("Test 'set' action", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(0);
  expect(await await neon.getElementAttr('m-6831ff33-aa39-4b0d-a383-e44585c6c644', 0)).toEqual({ pname: 'g', oct: '2' });
  let setAction = {
    'action': 'set',
    'param': {
      'elementId': 'm-6831ff33-aa39-4b0d-a383-e44585c6c644',
      'attrType': 'tilt',
      'attrValue': 'n'
    }
  };
  await await neon.edit(setAction, 0);
  expect(await await neon.getElementAttr('m-6831ff33-aa39-4b0d-a383-e44585c6c644', 0)).toEqual({ pname: 'g', oct: '2', tilt: 'n' });
});

test("Test 'split' action", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(0);
  let editorAction = {
    'action': 'split',
    'param': {
      'elementId': 'm-6231e253-9c3a-4e4b-a9a8-a15b0091677d',
      'x': 1000
    }
  };
  expect(await neon.edit(editorAction, 0)).toBeTruthy();
  let newId = await neon.info(0);
  expect(await neon.getElementAttr(newId, 0)).toEqual({ n: '17' });
});
