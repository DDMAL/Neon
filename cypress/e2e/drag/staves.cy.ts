beforeEach(() => {
  cy.visitEditor('/editor.html?manifest=test');
});

describe('drag: staves', () => {
  beforeEach(() => {
    cy.clickAndExpectClass('#selByStaff', 'is-active');
  });

  /**
   * Select a staff, then drag it. Selection goes through `cy.clickStaff`
   * rather than clicking the `<g class="staff">` centre, because Neon
   * hit-tests staff clicks against the staff *lines* -- see the command.
   */
  function dragStaff(selector: string, dx: number, dy: number): void {
    cy.clickStaff(selector);
    cy.get(selector).first().should('have.class', 'selected');
    cy.dragElementNoClick(selector, dx, dy);
  }

  it('error: move out of bounds to the LEFT', () => {
    // Select the staff BEFORE measuring. Selecting highlights the staff, and
    // the highlight stroke widens its bounding rect by ~30px (see the
    // `stroke-width: 30px` rule Verovio is configured with), which moves the
    // reported `x` by half that. Measuring an unselected staff and comparing
    // it to a selected one reports a ~15px shift that has nothing to do with
    // the drag.
    cy.clickStaff('.staff');
    cy.get('.staff').first().should('have.class', 'selected');

    cy.get('.staff')
      .first()
      .then((el) => {
        const origin = el[0].getBoundingClientRect();

        cy.dragElementNoClick('.staff', -300, -0);

        // `should()` rather than `then()`: the rejected drag returns the staff
        // to its original position, and that has to be allowed to settle.
        // `then()` measures exactly once and can catch it mid-return.
        cy.get('.staff')
          .first()
          .should((moved) => {
            const { x, y } = moved[0].getBoundingClientRect();

            expect(x).to.be.closeTo(origin.x, 15);
            expect(y).to.be.closeTo(origin.y, 15);
          });
      });

    // User should be notified
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds to the RIGHT', () => {
    dragStaff('.staff', 200, 0);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds to the TOP', () => {
    dragStaff('.staff', 0, -300);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('error: move out of bounds to the BOTTOM', () => {
    dragStaff('.staff', 0, 1000);
    cy.contains('Drag action failed').should('be.visible');
  });

  it('safe: move within bounds', () => {
    dragStaff('.staff', 50, -30);

    // Staff should still be selected even after drag
    cy.get('.staff').first().should('have.class', 'selected');

    cy.contains('Drag action failed').should('not.exist');
  });

  // This test exists due to a previous issue where only the first staff
  // would have issues with dragging:
  // https://github.com/DDMAL/Neon/issues/700#issuecomment-1190243501
  it('error: move random staff out of bounds', () => {
    dragStaff('#m-c64a9618-0edc-436b-8255-ae6984012c01', 200, 0);
    cy.contains('Drag action failed').should('be.visible');
  });
});

export {};
