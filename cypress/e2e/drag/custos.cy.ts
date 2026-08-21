beforeEach(() => {
  cy.visitEditor('/editor.html?manifest=test', {
    onBeforeLoad(win) {
      cy.stub(win.console, 'log').as('consoleLog');
      cy.stub(win.console, 'error').as('consoleError');
    },
  });
});

describe('drag: custos', () => {
  beforeEach(() => {
    cy.get('#displayInfo').click();
    cy.clickAndExpectClass('#selByLayerElement', 'is-active');
  });

  it('test: custos should be moved', () => {
    const CUSTOS_ID = '#m-4491f296-9c5b-4fb5-a4ec-5fb3d6ece0f8';

    cy.get(CUSTOS_ID).trigger('mouseover', { force: true });
    cy.get('#element_info').should('contain', 'F3');

    cy.dragElement(CUSTOS_ID, 0, 50);

    cy.get(CUSTOS_ID).trigger('mouseover', { force: true });
    cy.get('#element_info').should('not.contain', 'F3');

    // To confirm that the custos has been moved and saved in the SVG,
    // Check if any error from verovio has popped up in the console.
    cy.get('@consoleError').should('not.be.called');
  });
});
