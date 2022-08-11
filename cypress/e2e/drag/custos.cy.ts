/**
 * Drag function for syllables and staves
 */
function drag (selector: string, offsetX = 0, offsetY = 0): void {
  // https://github.com/cypress-io/cypress/issues/3441#issuecomment-545292552
  cy.window().then(win => {
    cy.get(selector)
      .first()
      .click({ timeout: 100, force: true })
      .then(($custos) => {
        // Recommended way of storing variables:
        // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Closures
        const origin = $custos[0].getBoundingClientRect();

        cy.get(selector).first().trigger('mousedown', { view: win, force: true, timeout: 100 })
          .trigger('mousemove', offsetX, offsetY, { force: true })
          .trigger('mouseup', { view: win, force: true })
          .then(($custos) => {
            const moved = $custos[0].getBoundingClientRect();
            
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

beforeEach(() => {
  cy.visit('http://localhost:8080/editor.html?manifest=test', {
    onBeforeLoad(win) {
      cy.stub(win.console, 'log').as('consoleLog');
      cy.stub(win.console, 'error').as('consoleError');
    }
  });
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

describe('drag: custos', () => {
  beforeEach(() => {
    cy.get('#selByLayerElement').click().should('have.class', 'is-active');
  });

  it('test: custos should be moved', () => {
    const CUSTOS_ID = '#m-4491f296-9c5b-4fb5-a4ec-5fb3d6ece0f8';

    drag(CUSTOS_ID, -100, 0);

    // To confirm that the custos has been moved and saved in the SVG,
    // Check if any error from verovio has popped up in the console.
    cy.get('@consoleError').should('not.be.called');
  });
});
