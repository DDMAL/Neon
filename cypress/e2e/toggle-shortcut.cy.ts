/**
 * `l` toggles a ligature (Square) or connection (Hufnagel) between the two
 * selected neume components. https://github.com/DDMAL/Neon/issues/1359
 *
 * Results are read from the MEI itself - through the "Download MEI" link,
 * with the download suppressed - and from the rendered glyphs, never from the
 * success notification alone. Notifications are only used as a point to wait
 * for before reading the result.
 */

type Notation = {
  name: string;
  manifest: string;
  noun: 'Ligature' | 'Connection';
  // Two adjacent nc's of one neume that the toggle applies to.
  first: string;
  second: string;
};

const NOTATIONS: Notation[] = [
  {
    // Square sample, a two-nc clivis (d3 -> c3) of an unlinked syllable.
    name: 'Square',
    manifest: 'test',
    noun: 'Ligature',
    first: 'm-a7f25736-be07-49de-8a59-88e2341f5fb3',
    second: 'm-d8b82058-2d30-4679-8b22-658f937a9888',
  },
  {
    // Same pair as drag/hufnagel-ligature.cy.ts.
    name: 'Hufnagel',
    manifest: 'St_Gall_022r_one_staff',
    noun: 'Connection',
    first: 'd1vfpl6j',
    second: 'q1x6mj1e',
  },
];

/** Glyphs Neon draws for a connected pair (see Grouping.isConnected). */
const CONNECTOR_GLYPH = /E9B[456789ABC]/;

/**
 * Neon keeps saved pages in PouchDB ("Neon"). Remove it so a save made here
 * does not leak into other specs that open the same sample.
 *
 * Before the editor is opened in a test the AUT is on about:blank, so the
 * delete must complete right away. Once a page holds the database open, it
 * can only be left pending (`whilePageOpen`); it then completes as soon as
 * Cypress navigates the page away, before any later page can open it again.
 */
function clearNeonDb(whilePageOpen = false): void {
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
function readMei(): Cypress.Chainable<Document> {
  // The href holds the whole page as base64; keep it out of the command log,
  // which otherwise slows the runner down badly.
  cy.get('#getmei', { log: false }).then(($link) => {
    const link = $link[0];
    link.setAttribute('href', '#');
    // Keep the click from actually downloading or navigating.
    link.addEventListener('click', (e) => e.preventDefault(), { once: true });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
  });
  cy.log('read MEI');
  return cy
    .get('#getmei', { log: false })
    .should(($link) => {
      const ready = ($link.attr('href') ?? '').startsWith('data:');
      expect(ready, 'MEI export ready').to.equal(true);
    })
    .then(($link) => {
      const base64 = $link.attr('href').split(',')[1];
      return new DOMParser().parseFromString(atob(base64), 'text/xml');
    });
}

function findNc(doc: Document, id: string): Element {
  const nc = Array.from(doc.getElementsByTagName('nc')).find(
    (el) => el.getAttribute('xml:id') === id,
  );
  // Not `.to.exist`: Cypress reads that as "attached to the page" for nodes,
  // and this one lives in a parsed MEI document.
  expect(nc, `nc ${id} in MEI`).to.not.equal(undefined);
  return nc;
}

/** The connection-related attributes of the pair, as a comparable string. */
function pairState(doc: Document, n: Notation): string {
  return [n.first, n.second]
    .map((id) => {
      const nc = findNc(doc, id);
      return `${id}:ligated=${nc.getAttribute('ligated') ?? ''},con=${
        nc.getAttribute('con') ?? ''
      }`;
    })
    .join(' ');
}

function isConnectedInMei(doc: Document, n: Notation): boolean {
  const first = findNc(doc, n.first);
  const second = findNc(doc, n.second);
  if (n.name === 'Square') {
    return (
      first.getAttribute('ligated') === 'true' &&
      second.getAttribute('ligated') === 'true'
    );
  }
  return second.getAttribute('con') === 'e';
}

function expectRendered(n: Notation, connected: boolean): void {
  cy.get(`#${n.first} use, #${n.second} use`).should(($uses) => {
    const hrefs = $uses
      .toArray()
      .map((use) => use.getAttribute('xlink:href') ?? '');
    expect(
      hrefs.some((href) => CONNECTOR_GLYPH.test(href)),
      `connector glyph drawn (${hrefs.join(', ')})`,
    ).to.equal(connected);
  });
}

/**
 * Edits and undo/redo are asynchronous and readMei does not retry, so call
 * this only after something that waits for the edit to land - typically
 * expectRendered, which retries until the page is re-drawn.
 */
function expectMei(n: Notation, connected: boolean): void {
  readMei().then((doc) => {
    expect(isConnectedInMei(doc, n), pairState(doc, n)).to.equal(connected);
  });
}

/**
 * Select the pair in NC mode, the way a user does: click, then Ctrl/⌘-click.
 * Clicking either half of a connected pair already selects both (Select.ts),
 * so the second click is only made when it is still needed.
 */
function selectPair(n: Notation): void {
  cy.get(`#${n.first} use`).first().click({ force: true });
  cy.get(`#${n.first}`).should('have.class', 'selected');
  cy.get(`#${n.second}`).then(($second) => {
    if ($second.hasClass('selected')) return;
    cy.get(`#${n.second} use`)
      .first()
      .click({ force: true, metaKey: true, ctrlKey: true });
  });
  cy.get(`#${n.first}`).should('have.class', 'selected');
  cy.get(`#${n.second}`).should('have.class', 'selected');
}

function pressL(options: Partial<KeyboardEventInit> = {}): void {
  cy.get('body').trigger('keydown', { key: 'l', code: 'KeyL', ...options });
}

/**
 * Assert that nothing was edited: give a stray edit time to land, then check
 * the selection survived (an edit re-renders and drops it) and the MEI pair
 * is as it was.
 */
function expectNoEdit(
  n: Notation,
  before: string,
  keepsSelection = true,
): void {
  cy.wait(600);
  if (keepsSelection) {
    cy.get(`#${n.first}`).should('have.class', 'selected');
  }
  readMei().then((doc) => expect(pairState(doc, n)).to.equal(before));
}

/** Assert the undo stack is empty, i.e. no edit has been made at all. */
function expectNothingToUndo(): void {
  cy.get('#undo').click();
  cy.contains('There is nothing left to undo.').should('exist');
}

function open(n: Notation): void {
  cy.visitEditor(`/editor.html?manifest=${n.manifest}`);
  cy.clickAndExpectClass('#selByNc', 'is-active');
}

for (const n of NOTATIONS) {
  describe(`toggle shortcut: ${n.name} ${n.noun}`, () => {
    let initial: string;

    beforeEach(() => {
      clearNeonDb();
      open(n);
      readMei().then((doc) => {
        initial = pairState(doc, n);
        expect(isConnectedInMei(doc, n), 'pair starts unconnected').to.equal(
          false,
        );
      });
    });

    after(() => {
      clearNeonDb(true);
    });

    it('l toggles without opening a menu, matches the button, and reverses', () => {
      selectPair(n);
      cy.get('body').type('l');
      cy.contains(`${n.noun} Toggled`).should('exist');
      expectRendered(n, true);
      expectMei(n, true);

      let viaShortcut: string;
      readMei().then((doc) => (viaShortcut = pairState(doc, n)));

      // Same pair via the button, from the same starting point.
      cy.get('#undo').click();
      expectRendered(n, false);
      expectMei(n, false);
      selectPair(n);
      cy.get('#toggle-ligature')
        .should('have.text', `Toggle ${n.noun}`)
        .click();
      expectRendered(n, true);
      readMei().then((doc) => expect(pairState(doc, n)).to.equal(viaShortcut));

      // Reselect the connected pair and press l again: reverses it. (Square
      // untoggling leaves ligated="false" rather than no attribute, so this
      // checks the state, not the original attribute text.)
      selectPair(n);
      cy.get('body').type('l');
      cy.contains(`${n.noun} Untoggled`).should('exist');
      expectRendered(n, false);
      expectMei(n, false);
    });

    it('undo and redo restore and reapply the toggle', () => {
      selectPair(n);
      cy.get('body').type('l');
      expectRendered(n, true);
      expectMei(n, true);

      cy.get('#undo').click();
      expectRendered(n, false);
      readMei().then((doc) => expect(pairState(doc, n)).to.equal(initial));

      cy.get('#redo').click();
      expectRendered(n, true);
      expectMei(n, true);
    });

    it('does nothing without an applicable NC selection', () => {
      // No selection.
      pressL();
      expectNoEdit(n, initial, false);

      // A pair the toggle does not apply to: nc's of two different neumes.
      cy.get(`#${n.first}`).then(($first) => {
        const other = Array.from(
          $first[0].ownerDocument.querySelectorAll('.nc'),
        ).find((nc) => nc.parentElement !== $first[0].parentElement);
        cy.get(`#${n.first} use`).first().click({ force: true });
        cy.get(`[id="${other.id}"] use`)
          .first()
          .click({ force: true, metaKey: true, ctrlKey: true });
      });
      cy.get('#toggle-ligature').should('not.exist');
      pressL();
      expectNoEdit(n, initial);

      // Not in NC mode: the neume holding the pair, in neume mode.
      cy.get('body').type('{esc}');
      cy.clickAndExpectClass('#selByNeume', 'is-active');
      cy.get(`#${n.first} use`).first().click({ force: true });
      cy.get(`#${n.first}`).parent('.neume').should('have.class', 'selected');
      pressL();
      cy.wait(600);
      cy.get(`#${n.first}`).parent('.neume').should('have.class', 'selected');
      readMei().then((doc) => expect(pairState(doc, n)).to.equal(initial));

      expectNothingToUndo();
    });

    it('ignores modifiers, key repeat, IME composition, text entry and dialogs', () => {
      selectPair(n);

      for (const modifier of ['ctrlKey', 'metaKey', 'altKey']) {
        pressL({ [modifier]: true });
        expectNoEdit(n, initial);
      }
      // Shift+l arrives as "L".
      pressL({ key: 'L', shiftKey: true });
      expectNoEdit(n, initial);

      pressL({ repeat: true });
      expectNoEdit(n, initial);

      pressL({ isComposing: true });
      pressL({ keyCode: 229 });
      expectNoEdit(n, initial);

      // Text entry: typing an "l" types an "l" and does not toggle.
      cy.document().then((doc) => {
        const input = doc.createElement('input');
        input.id = 'toggle-shortcut-input';
        const textarea = doc.createElement('textarea');
        textarea.id = 'toggle-shortcut-textarea';
        const editable = doc.createElement('div');
        editable.id = 'toggle-shortcut-editable';
        editable.contentEditable = 'true';
        editable.style.minHeight = '1em';
        doc.body.prepend(input, textarea, editable);
      });
      cy.get('#toggle-shortcut-input').type('l', { force: true });
      cy.get('#toggle-shortcut-input').should('have.value', 'l');
      cy.get('#toggle-shortcut-textarea').type('l', { force: true });
      cy.get('#toggle-shortcut-textarea').should('have.value', 'l');
      cy.get('#toggle-shortcut-editable').type('l', { force: true });
      cy.get('#toggle-shortcut-editable').should('have.text', 'l');
      expectNoEdit(n, initial);

      // Modal dialog open (Hotkeys).
      cy.get('#navbar-item-hotkeys').click({ force: true });
      cy.get('#neon-modal-window-container').should('be.visible');
      pressL();
      expectNoEdit(n, initial);

      cy.get('#neon-modal-window-header-close').click();
      cy.get('#neon-modal-window-container').should('not.be.visible');
      expectNothingToUndo();
    });

    it('one press toggles once after repeated select/unselect', () => {
      for (let i = 0; i < 3; i++) {
        selectPair(n);
        cy.get('body').type('{esc}');
        cy.get(`#${n.first}`).should('not.have.class', 'selected');
      }
      selectPair(n);
      cy.get('body').type('l');
      expectRendered(n, true);
      expectMei(n, true);

      // Exactly one edit on the stack.
      cy.get('#undo').click();
      expectRendered(n, false);
      readMei().then((doc) => expect(pairState(doc, n)).to.equal(initial));
      expectNothingToUndo();
    });

    // The two save tests run in order: the second compares the button's saved
    // result with what the first saved through the shortcut.
    let savedViaShortcut: string;

    function saveAndReopen(): void {
      cy.get('#save').click({ force: true });
      cy.contains('Saved').should('exist');
      open(n);
      expectRendered(n, true);
    }

    it('a toggle saved via l survives reopening', () => {
      selectPair(n);
      cy.get('body').type('l');
      expectRendered(n, true);
      expectMei(n, true);
      saveAndReopen();
      readMei().then((doc) => {
        expect(isConnectedInMei(doc, n)).to.equal(true);
        savedViaShortcut = pairState(doc, n);
      });
    });

    it('a toggle saved via the button reopens the same', () => {
      selectPair(n);
      cy.get('#toggle-ligature').click();
      expectRendered(n, true);
      expectMei(n, true);
      saveAndReopen();
      readMei().then((doc) => {
        expect(isConnectedInMei(doc, n)).to.equal(true);
        expect(pairState(doc, n)).to.equal(savedViaShortcut);
      });
    });
  });
}

describe('toggle shortcut: unaffected controls', () => {
  const n = NOTATIONS[0];

  beforeEach(() => {
    clearNeonDb();
    open(n);
  });

  after(() => {
    clearNeonDb(true);
  });

  it('g still ungroups a selected neume', () => {
    let neumes: number;
    readMei().then(
      (doc) => (neumes = doc.getElementsByTagName('neume').length),
    );
    cy.clickAndExpectClass('#selByNeume', 'is-active');
    cy.get(`#${n.first} use`).first().click({ force: true });
    cy.get(`#${n.first}`).parent('.neume').should('have.class', 'selected');
    cy.get('body').type('g');
    cy.contains('Ungrouping Success').should('exist');
    readMei().then((doc) =>
      expect(doc.getElementsByTagName('neume').length).to.equal(neumes + 1),
    );
  });

  it('the Hotkeys window lists l', () => {
    cy.get('#navbar-item-hotkeys').click({ force: true });
    cy.get('#neon-modal-window-content-hotkeys')
      .contains('.hotkey-entry-container', 'Toggle Ligature / Connection')
      .within(() => {
        cy.get('.hotkey-entry').should('have.text', 'l');
        cy.contains('(NC selection)');
      });
  });
});

export {};
