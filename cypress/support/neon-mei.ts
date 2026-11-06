/// <reference types="cypress" />
/**
 * MEI helpers shared by specs that check edits in the exported MEI.
 */

/** Same PouchDB clean-up as toggle-shortcut.cy.ts. */
export function clearNeonDb(whilePageOpen = false): void {
  cy.then(
    () =>
      new Cypress.Promise<void>((resolve, reject) => {
        const request = window.indexedDB.deleteDatabase('_pouch_Neon');
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        request.onblocked = () =>
          whilePageOpen
            ? resolve()
            : reject(new Error('Neon database is still open'));
      }),
  );
}

/** Read the current page's MEI through the "Download MEI" link. */
export function readMei(): Cypress.Chainable<Document> {
  cy.get('#getmei', { log: false }).then(($link) => {
    const link = $link[0];
    link.setAttribute('href', '#');
    link.addEventListener('click', (e) => e.preventDefault(), { once: true });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
  });
  return cy
    .get('#getmei', { log: false, timeout: 15000 })
    .should(($link) => {
      expect(($link.attr('href') ?? '').startsWith('data:')).to.equal(true);
    })
    .then(($link) => {
      const base64 = $link.attr('href').split(',')[1];
      return new DOMParser().parseFromString(atob(base64), 'text/xml');
    });
}

/**
 * The musical content of the MEI (facsimile zones + notation), i.e. the MEI
 * without its header, which holds change dates/timestamps.
 *
 * Neon gives `<pb>` a fresh xml:id on every export, even with no edit at all
 * (two exports in a row differ only there), so that id is left out.
 */
export function meiContent(doc: Document): string {
  const music = doc.getElementsByTagName('music')[0].cloneNode(true) as Element;
  Array.from(music.getElementsByTagName('pb')).forEach((pb) =>
    pb.removeAttribute('xml:id'),
  );
  return new XMLSerializer().serializeToString(music);
}

/**
 * Assert two MEI contents are identical without handing the whole documents
 * to Chai: logging or diffing strings this size freezes the runner. On a
 * mismatch, report only the first difference with some context.
 */
export function expectSameContent(actual: string, expected: string, label: string): void {
  if (actual === expected) {
    expect(true, `${label}: MEI content unchanged`).to.equal(true);
    return;
  }
  let i = 0;
  while (i < actual.length && actual[i] === expected[i]) i++;
  const around = (str: string): string => str.slice(Math.max(0, i - 80), i + 80);
  expect(
    around(actual),
    `${label}: MEI content changed at character ${i}`,
  ).to.equal(around(expected));
}

export function staffZone(doc: Document, staffId: string): Record<string, number> {
  // A rendered staff is the MEI <sb> (system begin) that carries its zone.
  const staff = Array.from(doc.getElementsByTagName('*')).find(
    (el) => el.getAttribute('xml:id') === staffId,
  );
  expect(staff, `staff ${staffId} in MEI`).to.not.equal(undefined);
  const zoneId = staff.getAttribute('facs').replace('#', '');
  const zone = Array.from(doc.getElementsByTagName('zone')).find(
    (el) => el.getAttribute('xml:id') === zoneId,
  );
  const n = (a: string): number => Number(zone.getAttribute(a));
  return { ulx: n('ulx'), uly: n('uly'), lrx: n('lrx'), lry: n('lry') };
}
