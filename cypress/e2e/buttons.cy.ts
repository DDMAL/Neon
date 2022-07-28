// Tests for validating buttons

describe('visual: activate sidebar buttons', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/edit/test.jsonld');
  });

  it('class: buttons should have `is-active` class when clicked', () => {
    cy.get('#selByStaff').click().should('have.class', 'is-active');
    cy.get('#selBySyllable').click().should('have.class', 'is-active');
    cy.get('#selByNeume').click().should('have.class', 'is-active');
    cy.get('#selByNc').click().should('have.class', 'is-active');
    cy.get('#selByLayerElement').click().should('have.class', 'is-active');
  });
});
