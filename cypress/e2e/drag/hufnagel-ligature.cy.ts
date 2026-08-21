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
describe('drag: Hufnagel ligature', () => {
  // Ascending 2nd (d -> e), the first two nc's of syllable "u" in
  // St_Gall_022r_one_staff: nc#d1vfpl6j, nc#q1x6mj1e.
  const FIRST_NC = '#d1vfpl6j';
  const SECOND_NC = '#q1x6mj1e';

  beforeEach(() => {
    cy.visitEditor('/editor.html?manifest=St_Gall_022r_one_staff');
    cy.clickAndExpectClass('#selByNc', 'is-active');

    // Select the ascending nc pair and toggle it into a ligature.
    cy.get(`${FIRST_NC} use`).click({ force: true });
    // Neon reads metaKey on Mac and ctrlKey elsewhere; set both so this
    // works on CI (Linux) and local dev machines alike.
    cy.get(`${SECOND_NC} use`).click({
      force: true,
      metaKey: true,
      ctrlKey: true,
    });
    cy.get('#toggle-ligature').click({ force: true });
    cy.contains('Ligature Toggled').should('be.visible');
  });

  it('safe: move ligature within bounds', () => {
    cy.get(FIRST_NC).then((el) => {
      const origin = el[0].getBoundingClientRect();

      cy.dragElement(`${FIRST_NC} use`, 30, -20);

      cy.contains('Drag action failed').should('not.exist');
      cy.get(FIRST_NC).should('have.class', 'selected');
      cy.get(SECOND_NC).should('have.class', 'selected');

      cy.get(FIRST_NC).then((moved) => {
        const { x, y } = moved[0].getBoundingClientRect();
        expect(x).to.not.be.closeTo(origin.x, 1);
        expect(y).to.not.be.closeTo(origin.y, 1);
      });
    });
  });
});

export {};
