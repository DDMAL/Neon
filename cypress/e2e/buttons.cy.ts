// Tests for validating buttons

describe('visual: activate sidebar buttons', () => {
  beforeEach(() => {
    cy.viewport('macbook-13');
    cy.visit('http://localhost:8080/editor.html?manifest=test');
    cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
  });

  it('class: buttons should have `is-active` class when clicked', () => {
    cy.get('#selByStaff').click().should('have.class', 'is-active');
    cy.get('#selBySyllable').click().should('have.class', 'is-active');
    cy.get('#selByNeume').click().should('have.class', 'is-active');
    cy.get('#selByNc').click().should('have.class', 'is-active');
    cy.get('#selByLayerElement').click().should('have.class', 'is-active');
  });
});
