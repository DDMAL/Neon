// Check if there are any error messages:
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error');
  cy.spy(win.console, 'warn');
});

beforeEach(() => {
  cy.visit('http://localhost:8080/dashboard.html');

  // Are there any errors in the console?
  cy.window().then((win) => {
    expect(win.console.error).to.have.callCount(0);
  });
});

describe('test: dashboard samples', () => {
  it('samples: exists?', () => {
    // Contain sample files, CF-005, etc.
    cy.get('#sample-docs-content').should('contain', 'CF-005');
    cy.get('#sample-docs-content').should('contain', 'CF-009');
  });
});
