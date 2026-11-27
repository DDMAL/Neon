beforeEach(() => {
  cy.visitEditor('/editor.html?manifest=test');
});

describe('displace: +1 octave', () => {
  beforeEach(() => {
    cy.get('#displayInfo').click();
    cy.get('#selByLayerElement').click();

    cy.get('.clef').first().click({ force: true });
  });

  it('pitch: octave should be incremented', () => {
    cy.get('#increment-octave').click({ force: true });

    // A random neume in the middle of the staff of whose pitch we know
    const NEUME_ID = '#m-f76386ee-7bfd-471a-8478-e1fb7e345757';

    cy.get(NEUME_ID).trigger('mouseover', { force: true });
    cy.get('#element_info').should('contain', 'F4').and('not.contain', 'F3');
  });

  it('pitch: ignore presence of divlines', () => {
    cy.get('#increment-octave').click({ force: true });

    // This is a known neume at the end of the staff, with 3 divlines before it.
    // According to our rules, the divlines should not matter: the pitch should
    // still be displaced:
    const NEUME_ID = '#m-61068be0-0f13-4ffb-bc64-65e6b643de60';

    cy.get(NEUME_ID).trigger('mouseover', { force: true });
    cy.get('#element_info').should('contain', 'D4').and('not.contain', 'D3');
  });

  it('visual: neume should not be visually displaced', () => {
    const NEUME_ID = '#m-61068be0-0f13-4ffb-bc64-65e6b643de60';

    // bounding box of the neume should be identical to what it was before:
    cy.get(NEUME_ID).then(($neume) => {
      const origin = $neume[0].getBoundingClientRect();

      cy.get('#increment-octave').click({ force: true });

      cy.get(NEUME_ID).then(($neume) => {
        const after = $neume[0].getBoundingClientRect();

        // The neume should not have been moved, give or take 1px
        expect(after.width).to.be.closeTo(origin.width, 1);
        expect(after.height).to.be.closeTo(origin.height, 1);
        expect(after.x).to.be.closeTo(origin.x, 1);
        expect(after.y).to.be.closeTo(origin.y, 1);
      });
    });
  });
});

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
