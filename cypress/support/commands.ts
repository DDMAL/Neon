/// <reference types="cypress" />

/**
 * Custom commands shared by the Neon E2E specs.
 *
 * Two properties of Neon drive how these are written:
 *
 * 1. Neon replaces the *entire* SVG whenever an edit is committed
 *    (`SingleView.updateSVG` → `group.replaceChild`). A subject held from
 *    before such an edit is detached afterwards, and Cypress cannot re-query
 *    the subject of an action command -- hence "the subject is no longer
 *    attached to the DOM" if you chain an assertion onto a `.click()`.
 *
 * 2. Dragging is driven by d3, which binds its drag behaviour to the specific
 *    nodes that were selected. A mouse gesture must therefore be delivered to
 *    ONE node from mousedown through mouseup: re-querying between the events
 *    can hand them to a replacement node that d3 knows nothing about, which
 *    silently does nothing at all -- worse than an error, because the test
 *    then just observes "nothing happened".
 *
 * The commands below reconcile the two: the click that changes selection (and
 * may re-render) is issued and allowed to settle first, then the gesture is
 * dispatched on a single freshly-queried node.
 */

/** Dispatch mousedown → mousemove → mouseup on one node, without re-querying. */
function gesture(selector: string, offsetX: number, offsetY: number): void {
  cy.window().then((win) => {
    // Query once, after any selection-induced re-render has settled, then keep
    // the same subject for the whole gesture (see note 2 above).
    cy.get(selector)
      .first()
      .then(($el) => {
        cy.wrap($el)
          .trigger('mousedown', 1, 1, { force: true, which: 1, view: win })
          .trigger('mousemove', offsetX + 1, offsetY + 1, { force: true })
          .trigger('mouseup', { force: true, view: win });
      });
  });
}

/**
 * Select the first element matching `selector`, then drag it by
 * (`offsetX`, `offsetY`) pixels.
 *
 * See https://github.com/cypress-io/cypress/issues/3441#issuecomment-545292552
 * for why the mousedown/mousemove/mouseup sequence is spelled out by hand.
 */
Cypress.Commands.add(
  'dragElement',
  (selector: string, offsetX = 0, offsetY = 0) => {
    // The click is its own command, so the re-render it may trigger happens
    // before -- not during -- the gesture below.
    cy.get(selector).first().click({ force: true });
    gesture(selector, offsetX, offsetY);
  },
);

/**
 * Same gesture as `dragElement`, without the leading click, for callers that
 * have already established the selection they want to drag (or that drag a
 * handle, such as a resize point).
 */
Cypress.Commands.add(
  'dragElementNoClick',
  (selector: string, offsetX = 0, offsetY = 0) => {
    gesture(selector, offsetX, offsetY);
  },
);

/**
 * Click `selector`, then assert the class landed, re-querying in between.
 * Replaces the unsafe `cy.get(x).click().should('have.class', c)` pattern.
 */
Cypress.Commands.add(
  'clickAndExpectClass',
  (selector: string, className: string) => {
    cy.get(selector).click();
    cy.get(selector).should('have.class', className);
  },
);

/**
 * Click the middle of the first staff matching `selector`.
 *
 * Neon resolves a staff click geometrically, against the bounding box of the
 * staff *lines* (`getStaffBBox` / `getStaffIdByCoords`) -- not against the
 * `<g class="staff">` element. Those two differ: the `<g>` also contains the
 * syllables and neumes drawn above and below the lines, so its centre can sit
 * outside the staff-lines box, and it moves as glyph fonts finish loading.
 * Clicking the element centre therefore misses the staff intermittently.
 *
 * So compute the staff-lines box ourselves and click its centre, dispatching
 * on `#svg_group` -- which is where the mousedown listener actually lives
 * (`Select.clickSelect('#svg_group, #svg_group use, #svg_group rect')`).
 */
Cypress.Commands.add('clickStaff', (selector = '.staff') => {
  cy.get(selector)
    .first()
    .then(($staff) => {
      const lines = Array.from($staff[0].querySelectorAll('path'));
      expect(lines.length, 'staff lines found').to.be.greaterThan(0);

      const boxes = lines.map((line) => line.getBoundingClientRect());
      const left = Math.min(...boxes.map((b) => b.left));
      const right = Math.max(...boxes.map((b) => b.right));
      const top = Math.min(...boxes.map((b) => b.top));
      const bottom = Math.max(...boxes.map((b) => b.bottom));

      const targetX = (left + right) / 2;
      const targetY = (top + bottom) / 2;

      cy.get('#svg_group').then(($group) => {
        const group = $group[0].getBoundingClientRect();
        cy.get('#svg_group').click(targetX - group.left, targetY - group.top, {
          force: true,
        });
      });
    });
});

/**
 * Visit an editor page and wait until it is actually ready to be interacted
 * with.
 *
 * `svg.neon-container.active-page` becoming visible is NOT sufficient: Neon
 * inserts the SVG and only then applies the view transform (`updateSVG` ->
 * `resetTransformations`, plus the zoom fit). Neon resolves clicks on staves
 * geometrically, mapping cursor coordinates through the page-margin CTM
 * (`getSVGRelCoords`), so a click issued while that transform is still
 * settling maps to the wrong place and silently selects nothing. On a loaded
 * CI runner that window is wide enough to lose regularly.
 *
 * So wait for the rendered geometry to stop changing before handing control
 * back to the test.
 */
Cypress.Commands.add(
  'visitEditor',
  (url: string, options?: Partial<Cypress.VisitOptions>) => {
    cy.visit(url, options);
    cy.get('svg.neon-container.active-page', { timeout: 15000 }).should(
      'be.visible',
    );

    let previous: string | null = null;
    cy.get('#svg_group', { timeout: 15000 }).should(($group) => {
      const staff = $group[0].querySelector('.staff');
      const box = staff
        ? JSON.stringify(staff.getBoundingClientRect())
        : 'none';
      const sample = `${$group[0].getAttribute('viewBox')}|${box}`;

      const settled = previous === sample;
      previous = sample;
      // Two consecutive identical samples mean the transform has landed.
      expect(settled, `editor geometry settled (${sample})`).to.equal(true);
    });
  },
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      dragElement(
        selector: string,
        offsetX?: number,
        offsetY?: number,
      ): Chainable<void>;
      dragElementNoClick(
        selector: string,
        offsetX?: number,
        offsetY?: number,
      ): Chainable<void>;
      clickAndExpectClass(selector: string, className: string): Chainable<void>;
      clickStaff(selector?: string): Chainable<void>;
      visitEditor(
        url: string,
        options?: Partial<Cypress.VisitOptions>,
      ): Chainable<void>;
    }
  }
}

export {};
