// Tests for selection of glyphs
// - Are selected glyphs visually shown?
// - Do resize points show up for bounding boxes and staves?
//
// Note on style: selecting an element makes Neon re-render, which replaces the
// whole SVG. Assertions are therefore never chained off the `.click()` that
// triggers them -- each one re-queries the selector so Cypress can retry
// against the live DOM instead of a detached node.

const STAFF_ID = '#m-bb55180f-699b-4266-bf98-99f75d5ba995';
const RED = 'rgb(221, 0, 0)';

// Load page and wait for SVG to be visible
beforeEach(() => {
  cy.visitEditor('/editor.html?manifest=test');
});

describe('select: syllable', () => {
  beforeEach(() => {
    cy.clickAndExpectClass('#selBySyllable', 'is-active');
  });

  it('highlight: syllable should be selected red', () => {
    cy.get('.syllable').first().as('syllable');
    cy.get('@syllable').click({ force: true });

    cy.get('@syllable').should('have.class', 'selected');
    cy.get('@syllable').should('have.css', 'fill', RED);

    cy.get('#svg_group > .resizePoint').should('have.length', 0);
  });
});

describe('select: staff', () => {
  beforeEach(() => {
    cy.clickAndExpectClass('#selByStaff', 'is-active');
  });

  /** Click the staff under test and wait until it is actually selected. */
  function selectStaff(): void {
    cy.get(STAFF_ID).should('exist');
    cy.clickStaff(STAFF_ID);
    cy.get(STAFF_ID).should('have.class', 'selected');
  }

  it('highlight: syllables, clefs, and accids', () => {
    selectStaff();

    // Check whether syllables, clefs, and accidentals have
    // - `highlighted` class
    // - Filled red
    cy.get(STAFF_ID).within(() => {
      cy.get('.syllable, .clef, .accid').should('have.class', 'highlighted');
      cy.get('.syllable, .clef, .accid').should('have.css', 'fill', RED);
    });
  });

  // Check whether divlines show up as red when a staff is selected
  it('highlight: divlines', () => {
    selectStaff();

    cy.get(STAFF_ID).within(() => {
      cy.get('.divLine').should('have.class', 'highlighted');
      cy.get('.divLine').should('have.css', 'color', RED);
    });
  });

  it('resize: resize points should show up', () => {
    selectStaff();

    cy.get('#svg_group').find('.resizePoint').should('have.length', 8);
  });
});

export {};
