/**
 * Diva (multi-page) view: editing handles and the drag out-of-page check.
 * https://github.com/DDMAL/Neon/issues/1392
 * https://github.com/DDMAL/Neon/issues/1409
 *
 * Diva has no `#bgimg`; the page bounds come from the page's Verovio SVG
 * (`svg.definition-scale`). Before this was fixed the lookup missed the page
 * in Diva and the check let every move through.
 *
 * The bundled Diva sample (Salzinnes) points at a IIIF manifest that no
 * longer exists, so the pages are served here from fixtures: a two-canvas
 * IIIF manifest over the existing CDN-Hsmu 001r / 002r MEI, with a plain
 * tile image.
 *
 * Known limitations (existing, not addressed here):
 * - `getSVGRelCoords` looks for `.active-page > .definition-scale`, which does
 *   not match in Diva, and throws on every staff-mode click. The staff on the
 *   first page is still selected, but staves on the second page cannot be,
 *   so only page 1 is covered.
 * - Diva's edit mode has no "Download MEI" handler (`initNavbar` is only
 *   called by SingleEditMode), so the MEI cannot be exported here. Edits are
 *   checked where they leave Neon instead: every editor action posted to the
 *   Verovio worker is recorded, and the re-rendered staff (drawn by Verovio
 *   from the edited MEI) is compared.
 */
import { clearNeonDb } from '../support/neon-mei';

type EditMessage = { action: string; editorAction: unknown };

/** The existing getSVGRelCoords failure described above. */
function isKnownStaffClickError(err: Error): boolean {
  return (
    /reading 'querySelector'/.test(err.message) &&
    /getSVGRelCoords/.test(String(err.stack))
  );
}

function openDiva(): void {
  cy.intercept('GET', '**/samples/manifests/diva-test.jsonld', {
    fixture: 'diva/neon-manifest.json',
  });
  cy.intercept('GET', '**/__diva__/manifest.json', {
    fixture: 'diva/iiif-manifest.json',
    headers: { 'content-type': 'application/json' },
  });
  cy.intercept('GET', '**/__diva__/img/**', {
    fixture: 'diva/tile.jpg',
    headers: { 'content-type': 'image/jpeg' },
  });
  cy.visit('/editor.html?manifest=diva-test', {
    onBeforeLoad(win) {
      // Record every editor action Neon sends to the Verovio worker.
      const edits: EditMessage[] = [];
      (win as unknown as { __edits: EditMessage[] }).__edits = edits;
      const post = win.Worker.prototype.postMessage;
      win.Worker.prototype.postMessage = function (
        this: Worker,
        message: EditMessage,
        ...rest: unknown[]
      ) {
        if (message?.action === 'edit') edits.push(message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (post as any).call(this, message, ...rest);
      };
    },
  });
  cy.get('.diva-inner', { timeout: 30000 }).should('exist');
  cy.get('.active-page .staff', { timeout: 30000 }).should('exist');
  cy.wait(1500);
}

/** Select the first staff of the active page by clicking its first line. */
function selectFirstStaff(): void {
  cy.get('#selByStaff').click({ force: true });
  cy.get('.active-page .staff')
    .first()
    .then(($staff) => {
      const line = $staff[0].querySelector('path').getBoundingClientRect();
      cy.get('.active-page .definition-scale').then(($page) => {
        const page = $page[0].getBoundingClientRect();
        cy.wrap($page).click(
          line.left + line.width / 2 - page.left,
          line.top + line.height / 2 - page.top,
          { force: true },
        );
      });
    });
  cy.get('.active-page .staff').first().should('have.class', 'selected');
  cy.get('#p-Left').should('exist');
}

/** Page-margin CTM of the active page (content units -> screen px). */
function pageMatrix(doc: Document): DOMMatrix {
  return doc
    .querySelector<SVGGraphicsElement>('.active-page .page-margin')
    .getScreenCTM();
}

/** Drag the selected staff by (dx, dy) page units, grabbing its first line. */
function dragStaffByUnits(dx: number, dy: number): void {
  cy.window().then((win) => {
    cy.get('.active-page .staff.selected').then(($staff) => {
      const staff = $staff[0] as unknown as SVGGraphicsElement;
      const k = staff.getScreenCTM().a;
      const g = staff.getBoundingClientRect();
      const line = staff.querySelector('path').getBoundingClientRect();
      const x = line.left + line.width / 2 - g.left;
      const y = line.top + line.height / 2 - g.top;
      cy.wrap($staff)
        .trigger('mousedown', x, y, { force: true, which: 1, view: win })
        .trigger('mousemove', x + dx * k, y + dy * k, { force: true })
        .trigger('mouseup', { force: true, view: win });
    });
  });
  // d3-drag swallows the next click for one task after a drag ends.
  cy.wait(100);
}

function firstLine(): Cypress.Chainable<string> {
  return cy.get('.active-page .staff path').first().invoke('attr', 'd');
}

/** Editor actions posted to the Verovio worker so far. */
function edits(): Cypress.Chainable<EditMessage[]> {
  return cy
    .window()
    .then((win) => (win as unknown as { __edits: EditMessage[] }).__edits);
}

/** Start point (x, y) of a staff line path `M x y L ...`. */
function lineStart(d: string): [number, number] {
  const [, x, y] = d.match(/^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/);
  return [Number(x), Number(y)];
}

describe('Diva: editing handles and drag bounds', () => {
  let knownErrors = 0;

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (isKnownStaffClickError(err)) {
        knownErrors++;
        return false;
      }
      return true;
    });
    clearNeonDb();
    openDiva();
  });

  after(() => {
    cy.log(`known getSVGRelCoords errors tolerated: ${knownErrors}`);
    clearNeonDb(true);
  });

  it('page bounds come from the page SVG and match the MEI surface', () => {
    cy.get('#bgimg').should('not.exist');
    cy.get('.active-page .definition-scale').should(($page) => {
      const box = ($page[0] as unknown as SVGSVGElement).viewBox.baseVal;
      // CDN-Hsmu 001r surface: lrx="7758" lry="9853"
      expect([box.x, box.y, box.width, box.height]).to.deep.equal([
        0, 0, 7758, 9853,
      ]);
    });
  });

  it('handles keep their CSS size through Diva zoom', () => {
    selectFirstStaff();
    cy.get('#p-Left').should(($c) => {
      expect($c[0].getBoundingClientRect().width).to.be.closeTo(12, 0.6);
    });
    cy.get('.diva-zoom-in-button').first().click({ force: true });
    cy.wait(2000);
    cy.get('#p-Left').should(($c) => {
      expect($c[0].getBoundingClientRect().width).to.be.closeTo(12, 0.6);
    });
  });

  it('allowed: a legal staff move is sent and redrawn', () => {
    selectFirstStaff();
    edits().then((e) => expect(e, 'no edit before the drag').to.have.length(0));
    firstLine().then((before) => {
      dragStaffByUnits(-150, 0);
      firstLine().should('not.equal', before);
      cy.contains('Drag action failed').should('not.exist');
      cy.document().then((doc) => {
        // One CSS px is 1/k units at Diva's zoom; allow about a pixel.
        const tolerance = Math.max(3, 1.5 / pageMatrix(doc).a);
        edits().then((e) => {
          expect(e, 'one edit sent').to.have.length(1);
          const chain = e[0].editorAction as {
            action: string;
            param: Array<{ action: string; param: { x: number; y: number } }>;
          };
          expect(chain.action).to.equal('chain');
          expect(chain.param[0].action).to.equal('drag');
          expect(chain.param[0].param.x).to.be.closeTo(-150, tolerance);
          expect(chain.param[0].param.y).to.be.closeTo(0, tolerance);
        });
        firstLine().then((after) => {
          const [x0, y0] = lineStart(before);
          const [x1, y1] = lineStart(after);
          expect(x1 - x0, 'redrawn staff moved').to.be.closeTo(-150, tolerance);
          expect(y1 - y0).to.be.closeTo(0, tolerance);
        });
      });
    });
  });

  it('blocked: glyphs above the staff would leave the page; restored', () => {
    selectFirstStaff();
    cy.document().then((doc) => {
      const m = pageMatrix(doc);
      const staff = doc.querySelector('.active-page .staff.selected');
      const top = (sel: string): number =>
        (Math.min(
          ...Array.from(staff.querySelectorAll(sel))
            .map((el) => el.getBoundingClientRect())
            .filter((r) => r.width > 0 || r.height > 0)
            .map((r) => r.top),
        ) -
          m.f) /
        m.d;
      const glyphTop = top('use');
      const linesTop = top('path');
      expect(glyphTop, 'a glyph sits above the staff lines').to.be.lessThan(
        linesTop - 10,
      );
      // Highest glyph ends above the page, staff lines stay on it.
      firstLine().then((d) => {
        dragStaffByUnits(0, -(glyphTop + (linesTop - glyphTop) / 2));
        cy.contains('Drag action failed').should('be.visible');
        firstLine().should('equal', d);
        cy.get('.active-page .staff')
          .first()
          .should('not.have.attr', 'transform');
      });
    });
    edits().then((e) => expect(e, 'no edit sent').to.have.length(0));
  });

  it('blocked: staff lines would leave the page; restored', () => {
    selectFirstStaff();
    cy.document().then((doc) => {
      const m = pageMatrix(doc);
      const left =
        (doc
          .querySelector('.active-page .staff.selected path')
          .getBoundingClientRect().left -
          m.e) /
        m.a;
      firstLine().then((d) => {
        dragStaffByUnits(-(left + 300), 0);
        cy.contains('Drag action failed').should('be.visible');
        firstLine().should('equal', d);
      });
    });
    edits().then((e) => expect(e, 'no edit sent').to.have.length(0));
  });
});

export {};
