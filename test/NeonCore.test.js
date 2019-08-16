/* eslint-env jest */
import NeonCore from '../src/NeonCore';

jest.mock('pouchdb');

const fs = require('fs');

const pathToMei = './test/resources/newtest.mei';
const pathToPNG = './test/resources/test.png';
const pathToContext = './src/utils/manifest/context.json';
var mei = {};

beforeAll(() => {
  let meiData = fs.readFileSync(pathToMei).toString();
  // Fetch API not present in JSDOM; mock it.
  window.fetch = jest.fn(data => {
    return Promise.resolve({
      ok: true,
      text: () => { return Promise.resolve(meiData); }
    });
  });
  let data = 'data:application/mei+xml;base64' + window.btoa(meiData);
  let context = JSON.parse(fs.readFileSync(pathToContext).toString());
  console.log(context);
  mei = {
    '@context': context,
    '@id': 'example:test',
    'title': 'Neon Core Test',
    'timestamp': (new Date()).toISOString(),
    'image': pathToPNG,
    'mei_annotations': [
      {
        'id': 'example:test-annotation',
        'type': 'Annotation',
        'body': data,
        'target': pathToPNG
      }
    ]
  };
});

afterAll(async () => {
  let neon = new NeonCore(mei);
  await neon.db.destroy();
});

test('Test failing editor action', async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  let editorAction = {
    'action': 'setText',
    'param': {
      'elementId': null,
      'text': 'test'
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeFalsy();
});

describe('Test textEdit module functions', () => {
  test("Test 'SetText' function", async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    let svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById('m-b24ba821-788e-4904-b611-448b30d2cc15').textContent.trim();
    expect(syl).toBe('mi');
    let editorAction = {
      'action': 'setText',
      'param': {
        'elementId': 'm-ca34b59d-7c2a-411c-8be5-c24e0fbe1ed4',
        'text': 'asdf'
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById('m-b24ba821-788e-4904-b611-448b30d2cc15').textContent.trim();
    expect(syl).toBe('asdf');
  });

  test('Test grouping and ungrouping with bounding boxes', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    let svg = await neon.getSVG(pathToPNG);

    /* there's no real logic to getting the boundingbox from the svg
     * normally the syl gets added as the last child of a syllable
     * and normally the sylTextRect comes after the text element
     * in the syl's list of children
     * although in these lines and the others like it
     * it's really just about trying stuff until you get the correct element
     */
    let rect1 = svg.getElementById('m-ca34b59d-7c2a-411c-8be5-c24e0fbe1ed4').children[1].children[1];
    let rect2 = svg.getElementById('m-432f94f2-3089-4767-b099-2b0573e55e99').children[1].children[1];
    expect(rect1.getAttribute('width')).toBe('259');
    expect(rect2.getAttribute('width')).toBe('310');
    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-691b53d6-e0d4-478c-aba8-78009ce36ea1', 'm-3f122e0e-0176-40c8-9368-29a407bf954f']
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let info = (await neon.info(pathToPNG)).uuid;
    svg = await neon.getSVG(pathToPNG);
    let groupedRect = svg.getElementById(info).children[0].children[1];
    expect(groupedRect.getAttribute('width')).toBe('642');

    // ungrouping test
    editorAction = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-691b53d6-e0d4-478c-aba8-78009ce36ea1', 'm-3f122e0e-0176-40c8-9368-29a407bf954f']
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    info = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    let arr = info.uuid;
    rect1 = svg.getElementById(arr[0]).children[0].children[1];
    rect2 = svg.getElementById(arr[1]).children[1].children[1];
    expect(rect1.getAttribute('width')).toBe('642');
    expect(rect2.getAttribute('width')).toBe('155');
  });

  test('Test bbox resizing', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    let svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById('m-9d333590-b8a3-44f6-8e1b-b72b80dfd3b5');
    let bbox = syl.children[1];
    expect(bbox.getAttribute('class')).toBe('sylTextRect');
    let initX = parseInt(bbox.getAttribute('x'));
    let initY = parseInt(bbox.getAttribute('y'));

    // try resizing by an arbitrary amount and make sure that it actually moved by that amount
    let editorAction = {
      'action': 'resize',
      'param': {
        'elementId': syl.getAttribute('id'),
        'ulx': (initX + 100),
        'uly': (initY + 100),
        'lrx': 100,
        'lry': 100
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    bbox = svg.getElementById('m-9d333590-b8a3-44f6-8e1b-b72b80dfd3b5').children[1];
    expect(parseInt(bbox.getAttribute('x'))).toBe(initX + 100);
    expect(parseInt(bbox.getAttribute('y'))).toBe(initY + 100);
  });

  test('Test bbox dragging', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    let svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById('m-4929be85-acef-4b69-ba82-f329a3c17b33').children[1];
    let bbox = syl.children[1];
    expect(bbox.getAttribute('class')).toBe('sylTextRect');
    let initX = parseInt(bbox.getAttribute('x'));
    let initY = parseInt(bbox.getAttribute('y'));

    // again just moving by an arbitrary amount
    let editorAction = {
      'action': 'drag',
      'param': {
        'elementId': syl.getAttribute('id'),
        'x': 100,
        'y': 100
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    bbox = svg.getElementById('m-6e8c6717-bbda-4923-b584-416a3fdfbc24').children[1];
    expect(parseInt(bbox.getAttribute('x'))).toBe(initX + 100);
    expect(parseInt(bbox.getAttribute('y'))).toBe(initY - 100); // dragging is backwards
  });

  test('Test bbox insert behavior', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();

    // again just arbitrary coordinates
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'nc',
        'staffId': 'auto',
        'ulx': 939,
        'uly': 2452
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let svg = await neon.getSVG(pathToPNG);
    let info = await neon.info(pathToPNG);
    let nc = svg.getElementById(info.uuid);
    expect(nc.getAttribute('class')).toBe('nc');
    let syllable = nc.parentElement.parentElement;
    expect(syllable.getAttribute('class')).toBe('syllable');
    let bbox = syllable.children[1].children[1];
    expect(bbox.getAttribute('class')).toBe('sylTextRect');
  });
});

test("Test 'getElementAttr' function", async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG); // for some reason verovio can't recognize the ids if this isn't done
  let atts = await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG);
  expect(atts['pname']).toBe('a');
  expect(atts['oct']).toBe('2');
});

test("Test 'drag' action, neume", async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let originalAtts = await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG);
  let editorAction = {
    'action': 'drag',
    'param': {
      'elementId': 'm-044e7093-895e-4a78-bbda-7f1779a896d4',
      'x': 2,
      'y': 34
    }
  };
  await neon.edit(editorAction, pathToPNG);
  let newAtts = await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG);

  expect(originalAtts['pname']).toBe('a');
  expect(originalAtts['oct']).toBe('2');

  expect(newAtts['pname']).toBe('b');
  expect(newAtts['oct']).toBe('2');
});

describe('Test insert editor action', () => {
  test("Test 'insert' action, punctum", async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'nc',
        'staffId': 'auto',
        'ulx': 939,
        'uly': 2462
      }
    };
    await neon.edit(editorAction, pathToPNG);
    let insertAtts = await neon.getElementAttr((await neon.info(pathToPNG)).uuid, pathToPNG);
    expect(insertAtts['pname']).toBe('e');
    expect(insertAtts['oct']).toBe('3');
  });

  test("Test 'insert' action, clef", async () => {
    let neon = new NeonCore(mei);
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
    let insertAtts = await neon.getElementAttr((await neon.info(pathToPNG)).uuid, pathToPNG);
    expect(insertAtts['shape']).toBe('C');
    expect(insertAtts['line']).toBe('3');
  });

  test("Test 'insert' action, custos", async () => {
    let neon = new NeonCore(mei);
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
    let insertAtts = await neon.getElementAttr((await neon.info(pathToPNG)).uuid, pathToPNG);
    expect(insertAtts.pname).toBe('c');
    expect(insertAtts.oct).toBe('3');
  });
  test("Test 'insert' action, nc", async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let editorAction = {
      'action': 'insert',
      'param': {
        'elementType': 'nc',
        'staffId': 'auto',
        'ulx': 1337,
        'uly': 665
      }
    };
    await neon.edit(editorAction, pathToPNG);
    let insertAtts = await neon.getElementAttr((await neon.info(pathToPNG)).uuid, pathToPNG);
    expect(insertAtts.pname).toBe('d');
    expect(insertAtts.oct).toBe('3');
  });
});

describe("Test 'group and ungroup' functions", () => {
  test("Test 'group/ungroup' functions, nc, syllable", async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['neume-0000001155883838', 'neume-0000001837566710']
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let editorAction2 = {
      'action': 'group',
      'param': {
        'groupType': 'nc',
        'elementIds': ['nc-0000000790425780', 'nc-0000000963196713']
      }
    };
    expect(await neon.edit(editorAction2, pathToPNG)).toBeTruthy();

    let editorAction3 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'nc',
        'elementIds': ['nc-0000000790425780', 'nc-0000000963196713']
      }
    };
    expect(await neon.edit(editorAction3, pathToPNG)).toBeTruthy();
    let editorAction4 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['neume-0000001155883838', 'neume-0000001837566710']
      }
    };
    expect(await neon.edit(editorAction4, pathToPNG)).toBeTruthy();
  });

  test("Test 'group/ungroup' functions, neume with multiple fullParents", async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);

    let editorAction = {
      'action': 'setText',
      'param': {
        'elementId': 'm-ca34b59d-7c2a-411c-8be5-c24e0fbe1ed4',
        'text': 'world!'
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById('m-ca34b59d-7c2a-411c-8be5-c24e0fbe1ed4').textContent.trim();
    expect(syl).toBe('world!');
    editorAction = {
      'action': 'setText',
      'param': {
        'elementId': 'm-432f94f2-3089-4767-b099-2b0573e55e99',
        'text': 'hello'
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById('m-432f94f2-3089-4767-b099-2b0573e55e99').textContent.trim();
    expect(syl).toBe('hello');
    let editorAction2 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-691b53d6-e0d4-478c-aba8-78009ce36ea1', 'm-3f122e0e-0176-40c8-9368-29a407bf954f']
      }
    };
    expect(await neon.edit(editorAction2, pathToPNG)).toBeTruthy();
    let info = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(info.uuid).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world!hello');

    let editorAction3 = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['m-691b53d6-e0d4-478c-aba8-78009ce36ea1', 'm-3f122e0e-0176-40c8-9368-29a407bf954f']
      }
    };
    expect(await neon.edit(editorAction3, pathToPNG)).toBeTruthy();
    let info2 = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    let array = info2.uuid;
    syl = svg.getElementById(array[0]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world!hello');
    syl = svg.getElementById(array[1]).textContent.trim();
    expect(syl).toBe('');
  });

  test("Test 'group/ungroup' functions, neueme with one fullParent", async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let setupSetText = {
      'action': 'setText',
      'param': {
        'elementId': 'syllable-0000001585962296',
        'text': 'hello'
      }
    };

    expect(await neon.edit(setupSetText, pathToPNG)).toBeTruthy();
    let svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById('syllable-0000001585962296').textContent.trim();
    expect(syl).toBe('hello');

    setupSetText = {
      'action': 'setText',
      'param': {
        'elementId': 'syllable-0000000338767184',
        'text': 'world'
      }
    };

    expect(await neon.edit(setupSetText, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById('syllable-0000000338767184').textContent.trim();
    expect(syl).toBe('world');

    let editorAction = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['neume-0000000137236976', 'neume-0000000484383177', 'neume-0000000680908622']
      }
    };
    expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
    let info = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(info.uuid).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world');
    syl = svg.getElementById('syllable-0000001585962296').textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('hello');

    let ungroupAction = {
      'action': 'ungroup',
      'param': {
        'groupType': 'neume',
        'elementIds': ['neume-0000000137236976', 'neume-0000000484383177', 'neume-0000000680908622']
      }
    };
    expect(await neon.edit(ungroupAction, pathToPNG)).toBeTruthy();
    let ungroupInfo = await neon.info(pathToPNG);
    let array = ungroupInfo.uuid;
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(array[0]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('world');
    syl = svg.getElementById(array[1]).textContent.trim().replace(/\s/g, '');
    expect(syl).toBe('');
  });

  test("Test 'group/ungroup' functions, neume with no fullParents", async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let svg = await neon.getSVG(pathToPNG);
    let setupName1 = {
      'action': 'setText',
      'param': {
        'elementId': 'syllable-0000001585962296',
        'text': 'hello'
      }
    };
    expect(await neon.edit(setupName1, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    let syl = svg.getElementById('syllable-0000001585962296').textContent.trim();
    expect(syl).toBe('hello');

    let setupName2 = {
      'action': 'setText',
      'param': {
        'elementId': 'syllable-0000000338767184',
        'text': 'world'
      }
    };
    expect(await neon.edit(setupName2, pathToPNG)).toBeTruthy();
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById('syllable-0000000338767184').textContent.trim();
    expect(syl).toBe('world');

    let setupGroup2 = {
      'action': 'group',
      'param': {
        'groupType': 'neume',
        'elementIds': ['neume-0000000137236976', 'neume-0000000484383177']
      }
    };
    expect(await neon.edit(setupGroup2, pathToPNG)).toBeTruthy();
    let mergedSyl = await neon.info(pathToPNG);
    svg = await neon.getSVG(pathToPNG);
    syl = svg.getElementById(mergedSyl.uuid).textContent.trim();
    expect(syl).toBe('');

    syl = svg.getElementById('syllable-0000001585962296').textContent.trim();
    expect(syl).toBe('hello');

    syl = svg.getElementById('syllable-0000000338767184').textContent.trim();
    expect(syl).toBe('world');
  });
});

test("Test 'remove' action", async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let editorAction = {
    'action': 'remove',
    'param': {
      'elementId': 'nc-0000001205387746'
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  let atts = await neon.getElementAttr('nc-0000001205387746', pathToPNG);
  expect(atts).toStrictEqual({});
});

describe('Test clef reassociation', () => {
  test('Test Syllable dragging', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let insertAction = {
      'action': 'insert',
      'param': {
        'elementType': 'clef',
        'staffId': 'auto',
        'ulx': 1857,
        'uly': 3376,
        'attributes': {
          'shape': 'F'
        }
      }
    };
    expect(await neon.edit(insertAction, pathToPNG)).toBeTruthy();
    let originalAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(originalAtts['pname']).toBe('f');
    let dragAction = {
      'action': 'drag',
      'param': {
        'elementId': 'm-9d477450-8ea4-4042-b4d0-a688ab4aa50b',
        'x': -1000,
        'y': 0
      }
    };
    expect(await neon.edit(dragAction, pathToPNG)).toBeTruthy();
    let newAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(newAtts['pname']).toBe('c');
  });
  test('Test neume dragging', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let insertAction = {
      'action': 'insert',
      'param': {
        'elementType': 'clef',
        'staffId': 'auto',
        'ulx': 1857,
        'uly': 3376,
        'attributes': {
          'shape': 'F'
        }
      }
    };
    expect(await neon.edit(insertAction, pathToPNG)).toBeTruthy();
    let originalAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(originalAtts['pname']).toBe('f');
    let dragAction = {
      'action': 'drag',
      'param': {
        'elementId': 'm-6897205e-78df-4745-9249-9fb2bbdd5c2b',
        'x': -1000,
        'y': 0
      }
    };
    expect(await neon.edit(dragAction, pathToPNG)).toBeTruthy();
    let newAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(newAtts['pname']).toBe('c');
  });
  test('Test clef inserting and deleting', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let originalAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(originalAtts['pname']).toBe('c');
    let insertAction = {
      'action': 'insert',
      'param': {
        'elementType': 'clef',
        'staffId': 'auto',
        'ulx': 1857,
        'uly': 3376,
        'attributes': {
          'shape': 'F'
        }
      }
    };
    expect(await neon.edit(insertAction, pathToPNG)).toBeTruthy();
    let clefId = (await neon.info(pathToPNG)).uuid;
    let newAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(newAtts['pname']).toBe('f');
    let deleteAction = {
      'action': 'remove',
      'param': {
        'elementId': clefId
      }
    };
    expect(await neon.edit(deleteAction, pathToPNG)).toBeTruthy();
    let lastAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(lastAtts['pname']).toBe('c');
  });
  test('Test clef dragging case 1', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let insertAction = {
      'action': 'insert',
      'param': {
        'elementType': 'clef',
        'staffId': 'auto',
        'ulx': 1857,
        'uly': 3376,
        'attributes': {
          'shape': 'F'
        }
      }
    };
    expect(await neon.edit(insertAction, pathToPNG)).toBeTruthy();
    let firstClefId = (await neon.info(pathToPNG)).uuid;
    let newBeforeAtts = await neon.getElementAttr('m-ddacb1cc-ce38-4fd3-91c0-1843c581e5c8', pathToPNG);
    let sameBeforeAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(newBeforeAtts['pname']).toBe('c');
    expect(sameBeforeAtts['pname']).toBe('f');
    let dragAction = {
      'action': 'drag',
      'param': {
        'elementId': firstClefId,
        'x': -600,
        'y': -64
      }
    };
    expect(await neon.edit(dragAction, pathToPNG)).toBeTruthy();
    let newAfterAtts = await neon.getElementAttr('m-ddacb1cc-ce38-4fd3-91c0-1843c581e5c8', pathToPNG);
    let sameAfterAtts = await neon.getElementAttr('m-814f9fd0-5cb5-4868-a8e6-ca6b8088bfb8', pathToPNG);
    expect(newAfterAtts['pname']).toBe('a');
    expect(sameAfterAtts['pname']).toBe('a');
  });
  test('Test clef dragging case 2', async () => {
    let neon = new NeonCore(mei);
    await neon.initDb();
    await neon.getSVG(pathToPNG);
    let firstInsert = {
      'action': 'insert',
      'param': {
        'elementType': 'clef',
        'staffId': 'auto',
        'ulx': 1793,
        'uly': 2611,
        'attributes': {
          'shape': 'F'
        }
      }
    };
    expect(await neon.edit(firstInsert, pathToPNG)).toBeTruthy();
    let secondInsert = {
      'action': 'insert',
      'param': {
        'elementType': 'clef',
        'staffId': 'auto',
        'ulx': 2650,
        'uly': 2680,
        'attributes': {
          'shape': 'C'
        }
      }
    };
    expect(await neon.edit(secondInsert, pathToPNG)).toBeTruthy();
    let secondClefId = (await neon.info(pathToPNG)).uuid;
    let firstBeforeAtts = await neon.getElementAttr('m-75c52573-311d-4bfc-adaf-3f6e8013aab2', pathToPNG);
    let secondBeforeAtts = await neon.getElementAttr('m-1dac2d79-7ac3-4859-bb35-c945c419d867', pathToPNG);
    expect(firstBeforeAtts['pname']).toBe('e');
    expect(secondBeforeAtts['pname']).toBe('d');
    let dragAction = {
      'action': 'drag',
      'param': {
        'elementId': secondClefId,
        'x': -2000,
        'y': -68
      }
    };
    expect(await neon.edit(dragAction, pathToPNG)).toBeTruthy();
    let firstAfterAtts = await neon.getElementAttr('m-11ffd2df-ed2a-4e20-919e-31e2602b9c19', pathToPNG);
    let secondAfterAtts = await neon.getElementAttr('m-22468132-4135-4fe5-a425-37c22201144e', pathToPNG);
    expect(firstAfterAtts['pname']).toBe('c');
    expect(secondAfterAtts['pname']).toBe('a');
  });
});

test('Test undo and redo', async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  // Should not be able to undo or redo now
  expect(await neon.undo(pathToPNG)).toBeFalsy();
  expect(await neon.redo(pathToPNG)).toBeFalsy();

  let editorAction = {
    'action': 'drag',
    'param': {
      'elementId': 'm-e43924c3-fd16-4664-8bd0-9e5b73659844',
      'x': 2,
      'y': 34
    }
  };
    // Ensure the editor is working
  expect(await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG)).toEqual({ pname: 'a', oct: '2' });
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  expect(await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG)).toEqual({ pname: 'b', oct: '2' });

  expect(await neon.undo(pathToPNG)).toBeTruthy();
  await neon.getSVG(pathToPNG);
  expect(await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG)).toEqual({ pname: 'a', oct: '2' });
  expect(await neon.redo(pathToPNG)).toBeTruthy();
  await neon.getSVG(pathToPNG);
  expect(await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG)).toEqual({ pname: 'b', oct: '2' });
});

test('Test chain action', async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let editorAction = {
    'action': 'chain',
    'param': [
      {
        'action': 'drag',
        'param': {
          'elementId': 'm-044e7093-895e-4a78-bbda-7f1779a896d4',
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
          'uly': 2462
        }
      }
    ]
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  let dragAtts = await neon.getElementAttr('m-044e7093-895e-4a78-bbda-7f1779a896d4', pathToPNG);
  let insertAtts = await neon.getElementAttr((await neon.info(pathToPNG))['1'].uuid, pathToPNG);
  expect(dragAtts.pname).toBe('b');
  expect(dragAtts.oct).toBe('2');
  expect(insertAtts.pname).toBe('e');
  expect(insertAtts.oct).toBe('3');
});

test("Test 'set' action", async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  expect(await await neon.getElementAttr('m-71c06e82-7558-42d9-96ab-40fb50b74e2c', pathToPNG)).toEqual({ pname: 'g', oct: '2' });
  let setAction = {
    'action': 'set',
    'param': {
      'elementId': 'm-71c06e82-7558-42d9-96ab-40fb50b74e2c',
      'attrType': 'tilt',
      'attrValue': 'n'
    }
  };
  await await neon.edit(setAction, pathToPNG);
  expect(await await neon.getElementAttr('m-71c06e82-7558-42d9-96ab-40fb50b74e2c', pathToPNG)).toEqual({ pname: 'g', oct: '2', tilt: 'n' });
});

test("Test 'split' action", async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let editorAction = {
    'action': 'split',
    'param': {
      'elementId': 'm-8beed2bc-3d4f-4456-ab50-c13c47a51525',
      'x': 1000
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  let newId = (await neon.info(pathToPNG)).uuid;
  expect(await neon.getElementAttr(newId, pathToPNG)).toEqual({ n: '15' });
});

test("Test 'change skew' action", async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  const id = 'm-8beed2bc-3d4f-4456-ab50-c13c47a51525';
  let editorAction = {
    'action': 'changeSkew',
    'param': {
      'elementId': id,
      'dy': 1000,
      'rightSide': true
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  let skew = (await neon.info(pathToPNG)).skew;
  expect(Math.round(skew)).toBe(-35);
});

test("Test 'change staff association' action", async () => {
  let neon = new NeonCore(mei);
  await neon.initDb();
  await neon.getSVG(pathToPNG);
  let svg = await neon.getSVG(pathToPNG);
  let staff = svg.getElementById('m-d0411b11-f0be-42ff-9bf6-255740eb3b94').parentElement.parentElement
  expect(staff.id).toBe('m-8beed2bc-3d4f-4456-ab50-c13c47a51525');
  let editorAction = {
    'action': 'drag',
    'param': {
      'elementId': "m-d0411b11-f0be-42ff-9bf6-255740eb3b94",
      'x': 0,
      'y': -500
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  editorAction = {
    'action': 'changeStaff',
    'param': {
      'elementId': 'm-d0411b11-f0be-42ff-9bf6-255740eb3b94'
    }
  };
  expect(await neon.edit(editorAction, pathToPNG)).toBeTruthy();
  svg = await neon.getSVG(pathToPNG);
  staff = svg.getElementById('m-d0411b11-f0be-42ff-9bf6-255740eb3b94').parentElement.parentElement;
  expect(staff.id).toBe('m-932e7223-76e8-4517-abba-fdbbf2cea050');
});
