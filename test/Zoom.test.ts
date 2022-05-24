/* eslint-env jest */

import { ViewBox } from '../src/SingleView/Zoom';

test('Check ViewBox constructor', () => {
  const viewBox = new ViewBox(300, 400);
  expect(viewBox.width).toBe(300);
  expect(viewBox.height).toBe(400);
});

test('Check \'get\' function', () => {
  const viewBox = new ViewBox(100, 100);
  viewBox.set(0, 0, 100, 100);
  expect(viewBox.get()).toBe('0 0 100 100');
});

test('Check \'translate\' function', () => {
  const viewBox = new ViewBox(100, 100);
  viewBox.set(0, 0, 100, 100);
  viewBox.translate(25, 35);
  expect(viewBox.minX).toBe(25);
  expect(viewBox.minY).toBe(35);
  expect(viewBox.width).toBe(100);
  expect(viewBox.height).toBe(100);
});

test('Check \'zoomTo\' function', () => {
  const viewBox = new ViewBox(100, 200);
  viewBox.zoomTo(2);
  expect(viewBox.width).toBe(50);
  expect(viewBox.height).toBe(100);
});
