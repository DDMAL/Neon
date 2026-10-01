/**
 * Regression test for https://github.com/DDMAL/Neon/issues/1389
 *
 * Hufnagel connector glyphs for ascending intervals (E9B4-E9B8) have
 * zero-sized bboxes, which used to be misread as "out of bounds" by
 * DragHandler.isDragOutOfBounds() and permanently locked dragging of a
 * connected pair.
 *
 * The connection is built through the UI rather than from a static fixture,
 * because the empty connector glyph only appears once a pair is connected.
 * The sample is Hufnagel, so that goes through toggleNeumeConnection (@con)
 * and the control is labelled "Toggle Connection".
 */
describe('drag: Hufnagel connection', () => {
  // Ascending 2nd (d -> e), the first two nc's of syllable "u" in
  // St_Gall_022r_one_staff: nc#d1vfpl6j, nc#q1x6mj1e.
  const FIRST_NC = '#d1vfpl6j';
  const SECOND_NC = '#q1x6mj1e';

  beforeEach(() => {
    cy.visitEditor('/editor.html?manifest=St_Gall_022r_one_staff');
    cy.clickAndExpectClass('#selByNc', 'is-active');

    // Select the ascending nc pair and connect it.
    cy.get(`${FIRST_NC} use`).click({ force: true });
    // Neon reads metaKey on Mac and ctrlKey elsewhere; set both so this
    // works on CI (Linux) and local dev machines alike.
    cy.get(`${SECOND_NC} use`).click({
      force: true,
      metaKey: true,
      ctrlKey: true,
    });
    cy.get('#toggle-ligature')
      .should('have.text', 'Toggle Connection')
      .click({ force: true });
    cy.contains('Connection Toggled').should('be.visible');
  });

  it('safe: move connected pair within bounds', () => {
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
