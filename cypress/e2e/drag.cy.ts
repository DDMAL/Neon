Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

function drag (selector: string, offsetX = 0, offsetY = 0) {
  // https://github.com/cypress-io/cypress/issues/3441#issuecomment-545292552
  cy.window().then(win => {
    cy.get(selector).first()
      .click(1, 1, { timeout: 100, force: true })
      .trigger('mousedown', 1, 1, { timeout: 100, force: true, which: 1, view: win })
      .trigger('mousemove', offsetX + 1, offsetY + 1, { force: true })
      .trigger('mouseup', { force: true, view: win });
  });
}

beforeEach(() => {
  cy.visit('http://localhost:8080/edit/test.jsonld');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

describe('drag: syllables', () => {
  beforeEach(() => {
    cy.get('#selBySyllable').click().should('have.class', 'is-active');
  });

  it('error: move random syllable out of bounds LEFT', () => {
    drag('#m-090b1f54-dce2-40bf-8b1f-ecc9be5a4c63', -300, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move random syllable out of bounds RIGHT', () => {
    drag('#m-090b1f54-dce2-40bf-8b1f-ecc9be5a4c63', 700, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move random syllable out of bounds TOP', () => {
    drag('#m-090b1f54-dce2-40bf-8b1f-ecc9be5a4c63', 0, -500);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move random syllable out of bounds BOTTOm', () => {
    drag('#m-090b1f54-dce2-40bf-8b1f-ecc9be5a4c63', 0, 500);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('safe: move syllable within bounds', () => {
    drag('#m-090b1f54-dce2-40bf-8b1f-ecc9be5a4c63', 50, -30);
    cy.contains('Drag action failed').should('not.exist');
  });
});

describe('drag: staves', () => {
  beforeEach(() => {
    cy.get('#selByStaff').click().should('have.class', 'is-active');
  });

  it('error: move first staff out of bounds to the LEFT', () => {
    cy.get('.staff').first().then(el => {
      const origin = el[0].getBoundingClientRect();

      drag('.staff', -300, -0);

      cy.get('.staff').first().then(el => {
        const { x, y } = el[0].getBoundingClientRect();

        expect(x).to.be.closeTo(origin.x, 15);
        expect(y).to.be.closeTo(origin.y, 15);
      });
    });

    // User should be notified
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move first staff out of bounds to the RIGHT', () => {
    drag('.staff', 200, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move first staff out of bounds to the TOP', () => {
    drag('.staff', 0, -300);
    cy.contains('Drag action failed').should('be.visible');
  });
  
  it('error: move first staff out of bounds to the BOTTOM', () => {
    drag('.staff', 0, 1000);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('safe: move first staff within bounds', () => {
    drag('.staff', 50, -30);
    cy.contains('Drag action failed').should('not.exist');
  });

  it('error: move random staff out of bounds', () => {
    drag('#m-c64a9618-0edc-436b-8255-ae6984012c01', 200, 0);
    cy.contains('Drag action failed').should('be.visible');
  });
});
