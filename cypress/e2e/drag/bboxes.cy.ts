// Tests for dragging glyphs
// - Do they visually move to the correct place?
// - Are there out-of-bound checks?

beforeEach(() => {
  cy.visitEditor('/editor.html?manifest=test');
});

describe('drag: bounding boxes', () => {
  beforeEach(() => {
    cy.get('#displayBBox').click();
    cy.get('#editMenu').scrollIntoView();
    cy.get('#selByBBox').should('be.visible').click();

    cy.get('.sylTextRect-display').should('have.length.gt', 0);
  });

  const BBOX_ID = '#m-8e6837fc-19d4-42c9-8266-cd54bb6f1dea';

  it('coords(safe): move bbox in the x-direction', () =>
    dragBBox(BBOX_ID, 350, 0));
  it('coords(safe): move bbox in the y-direction', () =>
    dragBBox(BBOX_ID, 0, 200));
  it('coords(safe): move bbox in both directions', () =>
    dragBBox(BBOX_ID, 100, 100));
});

/**
 * Drag function for bounding boxes:
 * Checks for whether the bounding box has moved correctly on mouseup
 *
 * Every measurement re-queries `selector`. Neon replaces the whole SVG when
 * the drag is committed, so the node the mouse events were dispatched on is
 * detached by the time we want its new position -- reading
 * getBoundingClientRect() off it would report a stale rect.
 */
function dragBBox(selector: string, offsetX = 0, offsetY = 0): void {
  cy.get(selector).click();

  cy.get(selector).then(($bbox) => {
    // Recommended way of storing variables:
    // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Closures
    const origin = $bbox[0].getBoundingClientRect();

    cy.dragElementNoClick(selector, offsetX, offsetY);

    cy.get(selector).should(($moved) => {
      const moved = $moved[0].getBoundingClientRect();

      // Bounding box coordinate checks:
      // We allow for some leeway on how close the positions have to be,
      // for any calculation rounding in d3 and Neon
      expect(moved.width).to.be.closeTo(origin.width, 1);
      expect(moved.height).to.be.closeTo(origin.height, 1);
      expect(moved.x).to.be.closeTo(origin.x + offsetX, 15);
      expect(moved.y).to.be.closeTo(origin.y + offsetY, 15);
    });
  });
}

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
