describe('resize: bounding boxes', () => {
  // Before each resize test:
  // Wait for the SVG to be visible, have bounding boxes displayed,
  // have selection mode to bounding boxes, and expect there to be bounding boxes.
  beforeEach(() => {
    cy.visit('http://localhost:8080/editor.html?manifest=test');
    cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
    cy.get('#displayBBox').click();
    cy.get('#selByBBox').click();

    cy.get('.sylTextRect-display').should('have.length.gt', 0);
  });

  const BBOX_ID = '#m-8e6837fc-19d4-42c9-8266-cd54bb6f1dea';

  // TODO: Fix in https://github.com/DDMAL/Neon/pull/937
  it.skip('oob: bbox should return to original size', () => {
    cy.get(BBOX_ID)
      .click()
      .should('have.class', 'selected');

    // cy.window() is necessary for d3 dragging
    cy.window().then(win => {
      cy.get('#p-BottomLeft')
        .trigger('mousedown', { timeout: 100, force: true, which: 1, view: win })
        .trigger('mousemove', -100, 0, { force: true })
        .trigger('mouseup', { force: true, view: win });
    });
  });
});
