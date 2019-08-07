/* eslint-env jest */

import * as ConvertMei from '../src/utils/ConvertMei.js';

const fs = require('fs');
const et = require('elementtree');

jest.mock('uuid/v4');

var originalTest, sbKey, staffKey;

beforeAll(() => {
  originalTest = fs.readFileSync('./test/resources/test.mei').toString();
  sbKey = fs.readFileSync('./test/resources/testSb.mei').toString();
  staffKey = fs.readFileSync('./test/resources/testStaff.mei').toString();
});

test('Verify results of \'convertStaffToSb\'', () => {
  let result = ConvertMei.convertStaffToSb(originalTest);
  let parsedKey = et.parse(sbKey).write({ xml_declaration: true, indent: 4 });
  expect(result).toBe(parsedKey);
});

test('Verify results of \'convertSbToStaff\'', () => {
  let result = ConvertMei.convertSbToStaff(sbKey);
  let parsedKey = et.parse(staffKey).write({ xml_declaration: true, indent: 4 });
  expect(result).toBe(parsedKey);
});
