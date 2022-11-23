/**
 * Drag function for syllables and staves
 */
function drag (selector: string, offsetX = 0, offsetY = 0): void {
  // https://github.com/cypress-io/cypress/issues/3441#issuecomment-545292552
  cy.window().then(win => {
    cy.get(selector).first()
      .click({ timeout: 100, force: true })
      .trigger('mousedown', 1, 1, { timeout: 100, force: true, which: 1, view: win })
      .trigger('mousemove', offsetX + 1, offsetY + 1, { force: true })
      .trigger('mouseup', { force: true, view: win });
  });
}

beforeEach(() => {
  cy.visit('http://localhost:8080/editor.html?manifest=test');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

describe('drag: staves', () => {
  beforeEach(() => {
    cy.get('#selByStaff').click().should('have.class', 'is-active');
  });

  it('error: move out of bounds to the LEFT', () => {
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

  it('error: move out of bounds to the RIGHT', () => {
    drag('.staff', 200, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds to the TOP', () => {
    drag('.staff', 0, -300);
    cy.contains('Drag action failed').should('be.visible');
  });
  
  it('error: move out of bounds to the BOTTOM', () => {
    drag('.staff', 0, 1000);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('safe: move within bounds', () => {
    drag('.staff', 50, -30);

    // Staff should still be selected even after drag
    cy.get('.staff').first()
      .should('have.class', 'selected');

    cy.contains('Drag action failed').should('not.exist');
  });

  // This test exists due to a previous issue where only the first staff
  // would have issues with dragging:
  // https://github.com/DDMAL/Neon/issues/700#issuecomment-1190243501
  it('error: move random staff out of bounds', () => {
    drag('#m-c64a9618-0edc-436b-8255-ae6984012c01', 200, 0);
    cy.contains('Drag action failed').should('be.visible');
  });
});

export {};
