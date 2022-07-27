Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

beforeEach(() => {
  cy.visit('http://localhost:8080/edit/test.jsonld');

  // SVG should be visible
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

describe('select: syllable', () => {
  beforeEach(() => {
    cy.get('#selBySyllable')
      .click()
      .should('have.class', 'is-active');
  });

  it('highlight: syllable should be selected red', () => {
    cy.get('.syllable').first().click(1, 1, { timeout: 100, force: true })
      .should('have.class', 'selected')
      .should('have.css', 'fill')
      .and('eq', 'rgb(221, 0, 0)');

    cy.get('#svg_group').find('.resizePoint').should('have.length', 0);
  });
});

describe('select: staff', () => {
  beforeEach(() => {
    cy.get('#selByStaff')
      .click()
      .should('have.class', 'is-active');
  });

  it('highlight: syllables, clefs, and accids', () => {
    const staffId = '#m-bb55180f-699b-4266-bf98-99f75d5ba995';

    cy.get(staffId)
      .should('exist')
      .click({ timeout: 100, force: true })
      .should('have.class', 'selected', { timeout: 200 })
      .within(() => {
        cy.get('.syllable, .clef, .accid')
          .should('have.class', 'highlighted')
          .and('have.css', 'fill')
          .and('eq', 'rgb(221, 0, 0)');
      });
  });

  it('highlight: divlines', () => {
    const staffId = '#m-bb55180f-699b-4266-bf98-99f75d5ba995';

    cy.get(staffId)
      .should('exist')
      .click({ timeout: 100, force: true })
      .should('have.class', 'selected', { timeout: 200 })
      .within(() => {
        cy.get('.divLine')
          .should('have.class', 'highlighted')
          .and('have.css', 'stroke')
          .and('eq', 'rgb(221, 0, 0)');
      });
  });

  it('resize: resize points should show up', () => {
    const staffId = '#m-bb55180f-699b-4266-bf98-99f75d5ba995';

    cy.get(staffId)
      .should('exist')
      .click({ timeout: 100, force: true })
      .should('have.class', 'selected', { timeout: 200 });

    cy.get('#svg_group').find('.resizePoint').should('have.length', 8);
  });

});
