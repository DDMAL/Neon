beforeEach(() => {
  cy.visit('http://localhost:8080/editor.html?manifest=test');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

describe('displace: +1 octave', () => {
  beforeEach(() => {
    cy.get('#displayInfo').click();
    cy.get('#selByLayerElement').click();

    cy.get('.clef').first().click({ timeout: 100, force: true });
  });

  it('pitch: octave should be incremented', () => {
    cy.get('#increment-octave').click({ timeout: 100, force: true });

    // A random neume in the middle of the staff of whose pitch we know
    const NEUME_ID = '#m-f76386ee-7bfd-471a-8478-e1fb7e345757';

    cy.get(NEUME_ID).trigger('mouseover', { force: true, timeout: 100 });
    cy.get('#neume_info').should('contain', 'F3').and('not.contain', 'F2');
  });

  it('pitch: ignore presence of divlines', () => {
    cy.get('#increment-octave').click({ timeout: 100, force: true });

    // This is a known neume at the end of the staff, with 3 divlines before it.
    // According to our rules, the divlines should not matter: the pitch should
    // still be displaced:
    const NEUME_ID = '#m-61068be0-0f13-4ffb-bc64-65e6b643de60';

    cy.get(NEUME_ID).trigger('mouseover', { force: true, timeout: 100 });
    cy.get('#neume_info').should('contain', 'D3').and('not.contain', 'D2');
  });

  it('visual: neume should not be visually displaced', () => {
    const NEUME_ID = '#m-61068be0-0f13-4ffb-bc64-65e6b643de60';

    // bounding box of the neume should be identical to what it was before:
    cy.get(NEUME_ID).then(($neume) => {
      const origin = $neume[0].getBoundingClientRect();

      cy.get('#increment-octave').click({ timeout: 100, force: true });

      cy.get(NEUME_ID).then($neume => {
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
