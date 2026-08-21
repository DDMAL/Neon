// Tests for validating buttons

describe('visual: activate sidebar buttons', () => {
  beforeEach(() => {
    cy.visitEditor('/editor.html?manifest=test');
  });

  it('class: buttons should have `is-active` class when clicked', () => {
    cy.clickAndExpectClass('#selByStaff', 'is-active');
    cy.clickAndExpectClass('#selBySyllable', 'is-active');
    cy.clickAndExpectClass('#selByNeume', 'is-active');
    cy.clickAndExpectClass('#selByNc', 'is-active');
    cy.clickAndExpectClass('#selByLayerElement', 'is-active');
  });
});
