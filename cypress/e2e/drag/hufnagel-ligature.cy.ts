/**
 * Regression test for https://github.com/DDMAL/Neon/issues/1389
 *
 * Hufnagel connector glyphs for ascending intervals (E9B4-E9B8) have
 * zero-sized bboxes, which used to be misread as "out of bounds" by
 * DragHandler.isDragOutOfBounds() and permanently locked ligature dragging.
 *
 * Verovio's native @con rendering isn't merged upstream yet, so Neon's
 * Hufnagel ligature control still goes through the existing toggleLigature
 * action (@ligated), same as Square notation. That's the only path that
 * currently renders the empty connector glyphs, so the test builds the
 * ligature via the UI instead of relying on a static @con MEI fixture.
 */
function drag(selector: string, offsetX = 0, offsetY = 0): void {
  cy.window().then((win) => {
    cy.get(selector)
      .first()
      .click({ timeout: 100, force: true })
      .trigger('mousedown', 1, 1, {
        timeout: 100,
        force: true,
        which: 1,
        view: win,
      })
      .trigger('mousemove', offsetX + 1, offsetY + 1, { force: true })
      .trigger('mouseup', { force: true, view: win });
  });
}

describe('drag: Hufnagel ligature', () => {
  // Ascending 2nd (d -> e), the first two nc's of syllable "u" in
  // St_Gall_022r_one_staff: nc#d1vfpl6j, nc#q1x6mj1e.
  const FIRST_NC = '#d1vfpl6j';
  const SECOND_NC = '#q1x6mj1e';

  beforeEach(() => {
    cy.visit(
      'http://localhost:8080/editor.html?manifest=St_Gall_022r_one_staff',
    );
    cy.get('svg.neon-container.active-page', { timeout: 10000 }).should(
      'be.visible',
    );
    cy.get('#selByNc').click().should('have.class', 'is-active');

    // Select the ascending nc pair and toggle it into a ligature.
    cy.get(`${FIRST_NC} use`).click({ force: true });
    cy.get(`${SECOND_NC} use`).click({ force: true, metaKey: true });
    cy.get('#toggle-ligature').click({ force: true });
    cy.contains('Ligature Toggled').should('be.visible');
  });

  it('safe: move ligature within bounds', () => {
    drag(`${FIRST_NC} use`, 30, -20);

    cy.contains('Drag action failed').should('not.exist');
    cy.get(FIRST_NC).should('have.class', 'selected');
    cy.get(SECOND_NC).should('have.class', 'selected');
  });
});

export {};
