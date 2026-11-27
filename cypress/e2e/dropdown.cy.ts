describe('test: dropdowns', () => {
  beforeEach(() => {
    cy.visitEditor('/editor.html?manifest=test');
  });

  function isOctaveDropdown(visible = true) {
    cy.contains('+1 Octave').should(visible ? 'be.visible' : 'not.be.visible');
    cy.contains('-1 Octave').should(visible ? 'be.visible' : 'not.be.visible');
  }

  it('test: multiple action dropdowns', () => {
    cy.clickAndExpectClass('#selByLayerElement', 'is-active');
    cy.get('.clef').first().click({ force: true });

    // Octave dropdown options should not be visible
    isOctaveDropdown(false);

    cy.contains('Displace Octave').click();

    isOctaveDropdown(true);

    // Clicking dropdown option should do something:
    // Success notification should be shown
    cy.contains('+1 Octave').click();
    cy.contains('Clef octave incremented');
  });

  it('test: click away from dropdown', () => {
    cy.clickAndExpectClass('#selByLayerElement', 'is-active');
    cy.get('.clef').first().click({ force: true });

    cy.contains('Displace Octave').click();
    isOctaveDropdown(true);

    cy.contains('Change Clef Shape').click({ force: true });
    isOctaveDropdown(false);

    cy.contains('Displace Octave').click();
    isOctaveDropdown(true);

    cy.get('body').click({ force: true });
    isOctaveDropdown(false);
  });
});
