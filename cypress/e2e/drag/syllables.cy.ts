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
  cy.viewport('macbook-13');
  cy.visit('http://localhost:8080/editor.html?manifest=test');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

//
// Currently, the tests only check whether the "Drag action failed" alert
// happens correctly or not.
describe('drag: syllables', () => {
  const SYLLABLE_ID = '#m-090b1f54-dce2-40bf-8b1f-ecc9be5a4c63';

  // Select by syllable before each test
  beforeEach(() => {
    cy.get('#selBySyllable').click();
  });

  it('error: move out of bounds LEFT', () => {
    drag(SYLLABLE_ID, -300, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds RIGHT', () => {
    drag(SYLLABLE_ID, 700, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds TOP', () => {
    drag(SYLLABLE_ID, 0, -500);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds BOTTOM', () => {
    drag(SYLLABLE_ID, 0, 500);
    cy.contains('Drag action failed').should('be.visible');

    cy.get(SYLLABLE_ID).should('have.class', 'selected');
  });

  it('safe: move within bounds', () => {
    drag(SYLLABLE_ID, 50, -30);
    cy.contains('Drag action failed').should('not.exist');

    // Syllable should still be selected even after drag
    cy.get(SYLLABLE_ID).should('have.class', 'selected');

  });
});

export {};
