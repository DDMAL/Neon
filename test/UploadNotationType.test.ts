import {
  getUploadNotationType,
  setUploadNotationType,
} from '../src/Dashboard/UploadNotationType';

describe('upload notation type preference', () => {
  beforeEach(() => window.localStorage.clear());

  test('defaults to square', () => {
    expect(getUploadNotationType()).toBe('square');
  });

  test('remembers the selected notation type', () => {
    setUploadNotationType('hufnagel');
    expect(getUploadNotationType()).toBe('hufnagel');

    setUploadNotationType('square');
    expect(getUploadNotationType()).toBe('square');
  });

  test('ignores unsupported notation types', () => {
    setUploadNotationType('hufnagel');
    setUploadNotationType('unsupported');

    expect(getUploadNotationType()).toBe('hufnagel');
  });
});
