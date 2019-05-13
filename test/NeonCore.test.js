/* eslint-env jest */
import NeonCore from '../src/NeonCore.js';

const fs = require('fs');

const pathToMei = './test/resources/test.mei';
var mei;

beforeAll(() => {
  mei = new Map();
  mei.set(0, fs.readFileSync(pathToMei).toString());
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
    let insertAtts = await neon.getElementAttr(await neon.info(), 0);
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
    let insertAtts = await neon.getElementAttr(await neon.info(), 0);
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
    let insertAtts = await neon.getElementAttr(await neon.info(), 0);
    expect(insertAtts.pname).toBe('g');
    expect(insertAtts.oct).toBe('2');
  });
});

test("Test 'remove' action", async () => {
  let neon = new NeonCore(mei, 'test');
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
  let insertAtts = await neon.getElementAttr(JSON.parse(neon.info())[1], 0);
  expect(dragAtts.pname).toBe('b');
  expect(dragAtts.oct).toBe('2');
  expect(insertAtts.pname).toBe('e');
  expect(insertAtts.oct).toBe('3');
});

test("Test 'set' action", async () => {
  let neon = new NeonCore(mei, 'test');
  await neon.initDb();
  await await neon.getSVG(0);
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
  let newId = await neon.info();
  expect(await neon.getElementAttr(newId, 0)).toEqual({ n: '17' });
});
