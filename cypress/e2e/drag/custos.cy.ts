/**
 * Drag function for syllables and staves
 */
function drag (selector: string, offsetX = 0, offsetY = 0): void {
  // https://github.com/cypress-io/cypress/issues/3441#issuecomment-545292552
  cy.window().then(win => {
    cy.get(selector).first()
      .click({ timeout: 100, force: true })
      .trigger('mousedown', 1, 1, { timeout: 100, force: true, which: 1, view: win })
      .trigger('mousemove', offsetX + 1, offsetY + 1, { force: true })
      .trigger('mouseup', { force: true, view: win });
  });
}

beforeEach(() => {
  cy.viewport('macbook-11');
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
    cy.get('#displayInfo').click();
    cy.get('#selByLayerElement').click().should('have.class', 'is-active');
  });

  it('test: custos should be moved', () => {
    const CUSTOS_ID = '#m-4491f296-9c5b-4fb5-a4ec-5fb3d6ece0f8';
    
    cy.get(CUSTOS_ID).trigger('mouseover', { force: true, timeout: 100 });
    cy.get('#neume_info').should('contain', 'F2');

    drag(CUSTOS_ID, 0, 50);

    cy.get(CUSTOS_ID).trigger('mouseover', { force: true, timeout: 100 });
    cy.get('#neume_info').should('not.contain', 'F2');

    // To confirm that the custos has been moved and saved in the SVG,
    // Check if any error from verovio has popped up in the console.
    cy.get('@consoleError').should('not.be.called');
  });
});
