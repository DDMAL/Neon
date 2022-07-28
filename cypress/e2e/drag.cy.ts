// Tests for dragging glyphs
// - Do they visually move to the correct place?
// - Are there out-of-bound checks?

/**
 * Drag function for syllables and staves
 */
function drag (selector: string, offsetX = 0, offsetY = 0) {
  // https://github.com/cypress-io/cypress/issues/3441#issuecomment-545292552
  cy.window().then(win => {
    cy.get(selector).first()
      .click({ timeout: 100, force: true })
      .trigger('mousedown', { timeout: 100, force: true, which: 1, view: win })
      .trigger('mousemove', offsetX, offsetY, { force: true })
      .trigger('mouseup', { force: true, view: win });
  });
}

/**
 * Drag function for bounding boxes:
 * Checks for whether the bounding box has moved correctly on mouseup
 */
function dragBBox (selector: string, offsetX = 0, offsetY = 0) {
  cy.window().then(win => {
    cy.get(selector)
      .click()
      .then(($bbox) => {
        // Recommended way of storing variables:
        // https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Closures
        const origin = $bbox[0].getBoundingClientRect();

        cy.get(selector).trigger('mousedown', { view: win, force: true, timeout: 100 })
          .trigger('mousemove', offsetX, offsetY, { force: true })
          .trigger('mouseup', { view: win, force: true })
          .then(($bbox) => {
            const moved = $bbox[0].getBoundingClientRect();
            
            // Bounding box coordinate checks:
            // We allow for some leeway on how close the positions have to be,
            // for any calculation rounding in d3 and Neon
            expect(moved.width).to.be.closeTo(origin.width, 1);
            expect(moved.height).to.be.closeTo(origin.height, 1);
            expect(moved.x).to.be.closeTo(origin.x + offsetX, 15);
            expect(moved.y).to.be.closeTo(origin.y + offsetY, 15);
          });
      });
  });
}

beforeEach(() => {
  cy.visit('http://localhost:8080/edit/test.jsonld');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

describe('drag: bounding boxes', () => {
  beforeEach(() => {
    cy.get('#displayBBox').click();
    cy.get('#selByBBox').click();

    cy.get('.sylTextRect-display').should('have.length.gt', 0);
  });

  const BBOX_ID = '#m-8e6837fc-19d4-42c9-8266-cd54bb6f1dea';

  it('coords(safe): move bbox in the x-direction', () => dragBBox(BBOX_ID, 350, 0));
  it('coords(safe): move bbox in the y-direction', () => dragBBox(BBOX_ID, 0, 200));
  it('coords(safe): move bbox in both directions', () => dragBBox(BBOX_ID, 100, 100));

});

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

  it('error: move out of bounds BOTTOm', () => {
    drag(SYLLABLE_ID, 0, 500);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('safe: move within bounds', () => {
    drag(SYLLABLE_ID, 50, -30);
    cy.contains('Drag action failed').should('not.exist');
  });
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
