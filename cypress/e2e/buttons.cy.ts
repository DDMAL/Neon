describe('Side bar buttons should be turned active', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/edit/test.jsonld');
  });

  it('SelBy', () => {
    cy.get('#selByStaff').click().should('have.class', 'is-active');
    cy.get('#selBySyllable').click().should('have.class', 'is-active');
    cy.get('#selByNeume').click().should('have.class', 'is-active');
    cy.get('#selByNc').click().should('have.class', 'is-active');
    cy.get('#selByLayerElement').click().should('have.class', 'is-active');
  });
});