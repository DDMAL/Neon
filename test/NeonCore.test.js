/* eslint-env jest */
import NeonCore from '../src/NeonCore.js';

const fs = require('fs');
const verovio = require('verovio-dev');

const pathToMei = './test/resources/test.mei';
const pathToPNG = './test/resources/test.png';
var mei, DOMParser, parser;

beforeAll(() => {
  mei = fs.readFileSync(pathToMei).toString();
  // DOMParser = new jsdom.JSDOM().window.DOMParser;
  parser = new window.DOMParser();
  let meiData = fs.readFileSync(pathToMei).toString();
  // Fetch API not present in JSDOM; mock it.
  window.fetch = jest.fn(data => {
    return Promise.resolve({
      ok: true,
      text: () => { return Promise.resolve(meiData); }
    });
  });
  let data = 'data:application/mei+xml;base64' + window.btoa(meiData);
  mei = [
    {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      'id': '#test-id',
      'type': 'Annotation',
      'body': data,
      'target': './test/resources/test.png'
    }
  ];
});

test("Test 'SetText' function", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  let svg = await neon.getSVG(pathToPNG);
  let syl = svg.getElementById('testsyl').textContent.trim();
  expect(syl).toBe('Hello');
  let editorAction = {
    'action': 'setText',
    'param': {
      'elementId': 'm-f715514e-cb0c-48e4-a1f9-a265ec1d5ca1',
      'text': 'asdf'
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  svg = await neon.getSVG(pathToPNG);
  syl = svg.getElementById('testsyl').textContent.trim();
  expect(syl).toBe('asdf');
});

afterAll(async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.db.destroy();
});

test("Test 'getElementAttr' function", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(pathToPNG); // for some reason verovio can't recognize the ids if this isn't done
  let atts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG);
  expect(atts['pname']).toBe('a');
  expect(atts['oct']).toBe('2');
});

test("Test 'drag' action, neume", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let originalAtts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG);
  let editorAction = {
    'action': 'drag',
    'param': {
      'elementId': 'm-54220197-ac7d-452c-8c34-b3d0bdbaefa0',
      'x': 2,
      'y': 34
    }
  };
  await neon.edit(editorAction, pathToPNG);
  let newAtts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG);

  expect(originalAtts['pname']).toBe('a');
  expect(originalAtts['oct']).toBe('2');

  expect(newAtts['pname']).toBe('b');
  expect(newAtts['oct']).toBe('2');
});

describe('Test insert editor action', () => {
  test("Test 'insert' action, punctum", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'nc',
        'staffId': 'auto',
        'ulx': 939,
        'uly': 2452
      }
    };
    await neon.edit(editorAction, pathToPNG);
    let insertAtts = await neon.getElementAttr(await neon.info(pathToPNG), pathToPNG);
    expect(insertAtts['pname']).toBe('e');
    expect(insertAtts['oct']).toBe('3');
  });

  test("Test 'insert' action, clef", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);
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
    await neon.edit(editorAction, pathToPNG);
    let insertAtts = await neon.getElementAttr(await neon.info(pathToPNG), pathToPNG);
    expect(insertAtts['shape']).toBe('C');
    expect(insertAtts['line']).toBe('3');
  });

  test("Test 'insert' action, custos", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'custos',
        'staffId': 'auto',
        'ulx': 1476,
        'uly': 690
      }
    };
    await neon.edit(editorAction, pathToPNG);
    let insertAtts = await neon.getElementAttr(await neon.info(pathToPNG), pathToPNG);
    expect(insertAtts.pname).toBe('g');
    expect(insertAtts.oct).toBe('2');
  });
  test("Test 'insert' action, nc", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'nc',
        'staffId': 'auto',
        'ulx': 1337,
        'uly': 655
      }
    };
    await neon.edit(editorAction, pathToPNG);
    let insertAtts = await neon.getElementAttr(await neon.info(pathToPNG), pathToPNG);
    expect(insertAtts.pname).toBe('a');
    expect(insertAtts.oct).toBe('2');
  });
});

describe("Test 'group and ungroup' functions", () => {
  test("Test 'group/ungroup' functions, nc, syllable", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    // group
    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let editorAction2 = {
      'action': 'group',
      'param': {
        'groupType': 'nc',
        'elementIds': ['m-ceab54b1-893e-42de-8fca-aeeb13254e19', 'm-2cf5243a-7042-42f9-b0c0-fd65f3ed67e0']
      }
    };
    expect(await neon.edit(editorAction2, pathToPNG)).toBeTruthy();

    // ungroup
    let editorAction3 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'nc',
        'elementIds': ['m-ceab54b1-893e-42de-8fca-aeeb13254e19', 'm-2cf5243a-7042-42f9-b0c0-fd65f3ed67e0']
      }
    };
    expect(await neon.edit(editorAction3, pathToPNG)).toBeTruthy();
    let editorAction4 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction4, pathToPNG)).toBeTruthy();
  });

  test("the test", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);

    // group
    let editorAction = {
      'action': 'setText',
      'param': {
        'elementId': 'm-ef58ea53-8d3a-4e9b-9b82-b9a057fe3fe4',
        'text': 'world!'
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById('m-ef58ea53-8d3a-4e9b-9b82-b9a057fe3fe4').textContent.trim();
    expect(syl).toBe('world!');
    let editorAction2 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction2, pathToPNG)).toBeTruthy();
    let info = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(info).textContent.trim().replace(/\s/g,'');
    expect(syl).toBe('Helloworld!');

    // ungroup
    let editorAction3 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(editorAction3, pathToPNG)).toBeTruthy();
    let info2 = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    let array = info2.split(' ');
    syl = svg.getElementById(array[0]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('Helloworld!');
    syl = svg.getElementById(array[1]).textContent.trim();
    expect(syl).toBe('');
  });

  test("Test 'group/ungroup' functions, neueme with one fullParent", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let setupGroup = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(setupGroup, pathToPNG)).toBeTruthy();
    let firstGroup = await neon.info(pathToPNG);
    let svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById(firstGroup).textContent.trim();
    expect(syl).toBe('Hello');
    let setupSetText = {
      'action': 'setText',
      'param': {
        'elementId': 'm-4450b0db-733d-459c-afad-e050eab0af63',
        'text': 'world!'
      }
    };

    expect(await neon.edit(setupSetText, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById('m-4450b0db-733d-459c-afad-e050eab0af63').textContent.trim();
    expect(syl).toBe('world!');

    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-4475cbc8-ad26-44ee-999b-d18ce43600ab', 'm-07ad2140-4fa1-45d4-af47-6733add00825']
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let info = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(info).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world!');
    syl = svg.getElementById(firstGroup).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('Hello');

    let ungroupAction = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-4475cbc8-ad26-44ee-999b-d18ce43600ab', 'm-07ad2140-4fa1-45d4-af47-6733add00825']
      }
    };
    expect(await neon.edit(ungroupAction, pathToPNG)).toBeTruthy();
    let ungroupInfo = await neon.info(pathToPNG);
    let array = ungroupInfo.split(' ');
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(array[0]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world!');
    syl = svg.getElementById(array[1]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('');
  });

  test("Test 'group/ungroup' functions, neume with no fullParents", async () => {
    let neon = new NeonCore(mei, 'test');
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let svg = await neon.getSVG(pathToPNG);
    let setupGroup1 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-daa3c33c-49c9-4afd-ae50-6e458f12b5a5', 'm-4475cbc8-ad26-44ee-999b-d18ce43600ab']
      }
    };
    expect(await neon.edit(setupGroup1, pathToPNG)).toBeTruthy();
    let firstSyl = await neon.info(pathToPNG);
    let setupName1 = {
      'action': 'setText',
      'param': {
        'elementId': firstSyl,
        'text': 'hello1'
      }
    };
    expect(await neon.edit(setupName1, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById(firstSyl).textContent.trim();
    expect(syl).toBe('hello1');
    let setupGroup2 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-07ad2140-4fa1-45d4-af47-6733add00825', 'm-2292df83-f3ad-400e-8fc3-4b69b241a30f']
      }
    };
    expect(await neon.edit(setupGroup2, pathToPNG)).toBeTruthy();
    let secondSyl = await neon.info(pathToPNG);
    let setupName2 = {
      'action': 'setText',
      'param': {
        'elementId': secondSyl,
        'text': 'hello2'
      }
    };
    expect(await neon.edit(setupName2, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(secondSyl).textContent.trim();
    expect(syl).toBe('hello2');

    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-4475cbc8-ad26-44ee-999b-d18ce43600ab', 'm-07ad2140-4fa1-45d4-af47-6733add00825']
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let mergedSyl = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(mergedSyl).textContent.trim();
    expect(syl).toBe('');

    syl = svg.getElementById(firstSyl).textContent.trim();
    expect(syl).toBe('hello1');

    syl = svg.getElementById(secondSyl).textContent.trim();
    expect(syl).toBe('hello2');
  });
});

test("Test 'remove' action", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let editorAction = {
    'action': 'remove',
    'param': {
      'elementId': 'm-ceab54b1-893e-42de-8fca-aeeb13254e19'
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  let atts = await neon.getElementAttr('m-ceab54b1-893e-42de-8fca-aeeb13254e19', pathToPNG);
  expect(atts).toStrictEqual({});
});

test('Test undo and redo', async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  // Should not be able to undo or redo now
  expect(await neon.undo(pathToPNG)).toBeFalsy();
  expect(await neon.redo(pathToPNG)).toBeFalsy();

  let editorAction = {
    'action': 'drag',
    'param': {
      'elementId': 'm-54220197-ac7d-452c-8c34-b3d0bdbaefa0',
      'x': 2,
      'y': 34
    }
  };
    // Ensure the editor is working
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG)).toEqual({ pname: 'a', oct: '2' });
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG)).toEqual({ pname: 'b', oct: '2' });

  expect(await neon.undo(pathToPNG)).toBeTruthy();
  await neon.getSVG(pathToPNG);
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG)).toEqual({ pname: 'a', oct: '2' });
  expect(await neon.redo(pathToPNG)).toBeTruthy();
  await neon.getSVG(pathToPNG);
  expect(await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG)).toEqual({ pname: 'b', oct: '2' });
});

test('Test chain action', async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(pathToPNG);
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
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  let dragAtts = await neon.getElementAttr('m-5ba56425-5c59-4f34-9e56-b86779cb4d6d', pathToPNG);
  let insertAtts = await neon.getElementAttr(JSON.parse(neon.info(pathToPNG))[1], pathToPNG);
  expect(dragAtts.pname).toBe('b');
  expect(dragAtts.oct).toBe('2');
  expect(insertAtts.pname).toBe('e');
  expect(insertAtts.oct).toBe('3');
});

test("Test 'set' action", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  expect(await await neon.getElementAttr('m-6831ff33-aa39-4b0d-a383-e44585c6c644', pathToPNG)).toEqual({ pname: 'g', oct: '2' });
  let setAction = {
    'action': 'set',
    'param': {
      'elementId': 'm-6831ff33-aa39-4b0d-a383-e44585c6c644',
      'attrType': 'tilt',
      'attrValue': 'n'
    }
  };
  await await neon.edit(setAction, pathToPNG);
  expect(await await neon.getElementAttr('m-6831ff33-aa39-4b0d-a383-e44585c6c644', pathToPNG)).toEqual({ pname: 'g', oct: '2', tilt: 'n' });
});

test("Test 'split' action", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let editorAction = {
    'action': 'split',
    'param': {
      'elementId': 'm-6231e253-9c3a-4e4b-a9a8-a15b0091677d',
      'x': 1000
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  let newId = await neon.info(pathToPNG);
  expect(await neon.getElementAttr(newId, pathToPNG)).toEqual({ n: '17' });
});
