import {
  forgetNotationType,
  getRecordedNotationType,
  recordNotationType,
} from '../src/utils/NotationTypeCache';

// ConvertMei imports Notification, which pulls in editor UI modules that
// need build-time globals. None of it is used when reading a notation type.
jest.mock('../src/utils/Notification', () => ({}));

function meiWithNotationType(notationType?: string): string {
  const attribute = notationType ? ` notationtype="${notationType}"` : '';
  return `<mei xmlns="http://www.music-encoding.org/ns/mei"><music><body><mdiv><score><scoreDef><staffGrp><staffDef n="1"${attribute}/></staffGrp></scoreDef></score></mdiv></body></music></mei>`;
}

describe('notation type cache', () => {
  beforeEach(() => window.localStorage.clear());

  test('has nothing for a document that was never recorded', () => {
    expect(getRecordedNotationType('doc')).toBeUndefined();
  });

  test('records hufnagel from neume.hufnagel', () => {
    recordNotationType('doc', meiWithNotationType('neume.hufnagel'));
    expect(getRecordedNotationType('doc')).toBe('hufnagel');
  });

  test('records square from neume.square', () => {
    recordNotationType('doc', meiWithNotationType('neume.square'));
    expect(getRecordedNotationType('doc')).toBe('square');
  });

  test('treats a bare or missing notation type as square', () => {
    recordNotationType('bare', meiWithNotationType('neume'));
    recordNotationType('missing', meiWithNotationType());
    recordNotationType('no-staffdef', '<mei/>');

    expect(getRecordedNotationType('bare')).toBe('square');
    expect(getRecordedNotationType('missing')).toBe('square');
    expect(getRecordedNotationType('no-staffdef')).toBe('square');
  });

  test('a later record replaces the earlier one', () => {
    recordNotationType('doc', meiWithNotationType('neume.square'));
    recordNotationType('doc', meiWithNotationType('neume.hufnagel'));
    expect(getRecordedNotationType('doc')).toBe('hufnagel');
  });

  test('keeps documents separate and forgets only the deleted one', () => {
    recordNotationType('a', meiWithNotationType('neume.hufnagel'));
    recordNotationType('b', meiWithNotationType('neume.square'));

    forgetNotationType('a');

    expect(getRecordedNotationType('a')).toBeUndefined();
    expect(getRecordedNotationType('b')).toBe('square');
  });

  test('ignores corrupted storage', () => {
    window.localStorage.setItem('neon-notation-types', 'not json');
    expect(getRecordedNotationType('doc')).toBeUndefined();

    recordNotationType('doc', meiWithNotationType('neume.hufnagel'));
    expect(getRecordedNotationType('doc')).toBe('hufnagel');
  });
});
