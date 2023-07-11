// Tests for dragging glyphs
// - Do they visually move to the correct place?
// - Are there out-of-bound checks?

beforeEach(() => {
  cy.visit('http://localhost:8080/editor.html?manifest=test');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

describe('drag: bounding boxes', () => {
  beforeEach(() => {
    cy.get('#displayBBox').click();
    cy.get('#editMenu').scrollIntoView();
    cy.get('#selByBBox').should('be.visible').click();

    cy.get('.sylTextRect-display').should('have.length.gt', 0);
  });

  const BBOX_ID = '#m-8e6837fc-19d4-42c9-8266-cd54bb6f1dea';

  it('coords(safe): move bbox in the x-direction', () => dragBBox(BBOX_ID, 350, 0));
  it('coords(safe): move bbox in the y-direction', () => dragBBox(BBOX_ID, 0, 200));
  it('coords(safe): move bbox in both directions', () => dragBBox(BBOX_ID, 100, 100));

});

/**
 * Drag function for bounding boxes:
 * Checks for whether the bounding box has moved correctly on mouseup
 */
function dragBBox (selector: string, offsetX = 0, offsetY = 0): void {
  cy.window().then(win => {
    cy.get(selector)
      .click()
      .then(($bbox) => {
        // Recommended way of storing variables:
        // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Closures
        const origin = $bbox[0].getBoundingClientRect();

        cy.get(selector).trigger('mousedown', { view: win, force: true, timeout: 100 })
          .trigger('mousemove', offsetX, offsetY, { force: true })
          .trigger('mouseup', { view: win, force: true })
          .then(($bbox) => {
            const moved = $bbox[0].getBoundingClientRect();
            
            // Bounding box coordinate checks:
            // We allow for some leeway on how close the positions have to be,
            // for any calculation rounding in d3 and Neon
            expect(moved.width).to.be.closeTo(origin.width, 1);
            expect(moved.height).to.be.closeTo(origin.height, 1);
            expect(moved.x).to.be.closeTo(origin.x + offsetX, 15);
            expect(moved.y).to.be.closeTo(origin.y + offsetY, 15);
          });
      });
  });
}


Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

