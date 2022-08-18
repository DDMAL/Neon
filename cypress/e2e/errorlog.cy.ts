// Tests for error log:
// NOTE: some of these tests may fail in the future if notification
// messages are changed. Cypress also is case-sensitive with `should('contains')`,
// so watch out!

describe('test: error log', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/editor.html?manifest=test');
    cy.clearLocalStorage();
  });

  it('startup: error log should not be visible', () => {
    cy.get('#right-column').scrollTo('bottom');
    cy.get('#error_log').should('not.be.visible');

    cy.get('#display-errors').click({ timeout: 100, force: true });

    cy.get('#right-column').scrollTo('bottom');
    cy.get('#error_log').should('be.visible');
  });

  it('saved: display setting should be respected after reload', () => {
    cy.get('#right-column').scrollTo('bottom');
    cy.get('#error_log').should('not.be.visible');

    cy.get('#display-errors').click({ timeout: 100, force: true });
    cy.reload();

    cy.get('#right-column').scrollTo('bottom');
    cy.get('#error_log').should('contain', 'Error Log');
  });

  it('content: should contain errors', () => {
    // Show error log:
    cy.get('#display-errors').click({ timeout: 100, force: true });

    // This should cause an error (out of bounds)!
    cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
    cy.get('#punctum').click({ timeout: 100, force: true });
    cy.get('#svg_group').click(5, 5, { timeout: 100, force: true });

    cy.get('#errorLogContents').should('include.text', 'out of bounds');
  });

  it('content: should contain warnings', () => {
    // Show error log:
    cy.get('#display-errors').click({ timeout: 100, force: true });

    // This should produce a warning
    cy.get('#remove-empty-syls').click({ force: true, timeout: 100 });

    // The error log should contain some notification about empty syllables
    cy.get('#errorLogContents').should('contain', 'empty syllables');

    // This should produce another warning
    cy.get('#remove-empty-neumes').click({ force: true, timeout: 100 });

    cy.get('#errorLogContents').contains('empty neumes', { matchCase: false });

    // Notifications should not disappear even after the default notification
    // cooldown time:
    cy.wait(3000);

    // And the previous one should still be there!
    cy.get('#errorLogContents').should('contain', 'empty syllables');
  });

  it('content: should NOT contain success', () => {
    // Show error log:
    cy.get('#display-errors').click({ timeout: 100, force: true });

    // This should produce a success
    cy.get('#save').click({ force: true, timeout: 100 });

    // The error log should NOT contain some notification about being saved
    // NOTE: For some reason, Cypress is case-sensitive for 'not.include.text',
    // which is why I check for both capitalized and not capitalized
    cy.get('#errorLogContents')
      .should('not.include.text', 'Save')
      .and('not.include.text', 'save');
  });
});
