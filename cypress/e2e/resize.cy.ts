describe('resize: bounding boxes', () => {
  // Before each resize test:
  // Wait for the SVG to be visible, have bounding boxes displayed,
  // have selection mode to bounding boxes, and expect there to be bounding boxes.
  beforeEach(() => {
    cy.visitEditor('/editor.html?manifest=test');
    cy.get('#displayBBox').click();
    cy.get('#selByBBox').click();

    cy.get('.sylTextRect-display').should('have.length.gt', 0);
  });

  const BBOX_ID = '#m-8e6837fc-19d4-42c9-8266-cd54bb6f1dea';

  it('oob: bbox should return to original size', () => {
    cy.get(BBOX_ID).click();
    cy.get(BBOX_ID).should('have.class', 'selected');

    cy.get(BBOX_ID).then(($bbox) => {
      const origin = $bbox[0].getBoundingClientRect();

      // Drag the bottom-left resize point far enough left to go out of
      // bounds; the bbox is expected to snap back to where it started.
      cy.dragElementNoClick('#p-BottomLeft', -100, 0);

      cy.get(BBOX_ID).should(($after) => {
        const after = $after[0].getBoundingClientRect();

        expect(after.width).to.be.closeTo(origin.width, 1);
        expect(after.height).to.be.closeTo(origin.height, 1);
        expect(after.x).to.be.closeTo(origin.x, 1);
        expect(after.y).to.be.closeTo(origin.y, 1);
      });
    });
  });
});

export {};
