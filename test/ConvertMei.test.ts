/* eslint-env jest */

import * as ConvertMei from '../src/utils/ConvertMei';

import * as fs from 'fs';
import * as et from 'elementtree';

jest.mock('uuid/v4');

let originalTest, sbKey, staffKey;

beforeAll(() => {
  originalTest = fs.readFileSync('./test/resources/test.mei').toString();
  sbKey = fs.readFileSync('./test/resources/testSb.mei').toString();
  staffKey = fs.readFileSync('./test/resources/testStaff.mei').toString();
});

test('Verify results of \'convertStaffToSb\'', () => {
  const result = ConvertMei.convertStaffToSb(originalTest);
  const parsedKey = et.parse(sbKey).write({ xml_declaration: true, indent: 4 });
  expect(result).toBe(parsedKey);
});

test('Verify results of \'convertSbToStaff\'', () => {
  const result = ConvertMei.convertSbToStaff(sbKey);
  const parsedKey = et.parse(staffKey).write({ xml_declaration: true, indent: 4 });
  expect(result).toBe(parsedKey);
});
