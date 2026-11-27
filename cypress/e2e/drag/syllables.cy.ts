beforeEach(() => {
  cy.visitEditor('/editor.html?manifest=test');
});

//
// Currently, the tests only check whether the "Drag action failed" alert
// happens correctly or not.
describe('drag: syllables', () => {
  const SYLLABLE_ID = '#m-090b1f54-dce2-40bf-8b1f-ecc9be5a4c63';

  // Select by syllable before each test
  beforeEach(() => {
    cy.clickAndExpectClass('#selBySyllable', 'is-active');
  });

  it('error: move out of bounds LEFT', () => {
    cy.dragElement(SYLLABLE_ID, -300, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds RIGHT', () => {
    cy.dragElement(SYLLABLE_ID, 700, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds TOP', () => {
    cy.dragElement(SYLLABLE_ID, 0, -500);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds BOTTOM', () => {
    cy.dragElement(SYLLABLE_ID, 0, 500);
    cy.contains('Drag action failed').should('be.visible');

    cy.get(SYLLABLE_ID).should('have.class', 'selected');
  });

  it('safe: move within bounds', () => {
    cy.dragElement(SYLLABLE_ID, 50, -30);
    cy.contains('Drag action failed').should('not.exist');

    // Syllable should still be selected even after drag
    cy.get(SYLLABLE_ID).should('have.class', 'selected');
  });
});

export {};
