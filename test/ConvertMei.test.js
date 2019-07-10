/* eslint-env jest */

import * as ConvertMei from '../src/utils/ConvertMei.js';

const fs = require('fs');
const et = require('elementtree');
var originalTest, sbKey;

beforeAll(() => {
  originalTest = fs.readFileSync('./test/resources/test.mei').toString();
  sbKey = fs.readFileSync('./test/resources/testSb.mei').toString();
});

test('Verify results of \'convertStaffToSb\'', () => {
  let result = ConvertMei.convertStaffToSb(originalTest);
  let parsedKey = et.parse(sbKey).write({ xml_declaration: true, indent: 4 });
  expect(result).toBe(parsedKey);
});
