beforeEach(() => {
  cy.visit('http://localhost:8080/editor.html?manifest=test');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

function setOpacity (val: number) {
  cy.get('#opacitySlider').as('range')
    .trigger('mousedown')
    .invoke('val', val)
    .trigger('change') // Zoom slider uses mouseup, but glyph/img opacity uses change event
    .trigger('mouseup');
}

function expectOpacity (val: number) {
  cy.get('#opacitySlider').as('range').should('have.value', val);
  cy.get('#mei_output').should('have.css', 'opacity').and('eq', String(val / 100));
  cy.get('#opacityOutput').should('have.text', String(val));
}

function expectToggleButton (val: number) {
  cy.get('#toggle-glyph-opacity > .slider-btn-img')
    .should('have.attr', 'src')
    .and('contain', val === 0 ? 'show-icon' : 'hide-icon');
}

describe('test: glyph opacity', () => {
  it('slider: set opacity to 0', () => {
    setOpacity(0);
    expectOpacity(0);
    expectToggleButton(0);
  });

  it('slider: set opacity to 30', () => {
    setOpacity(30);
    expectOpacity(30);
    expectToggleButton(30);
  });

  it('slider: set opacity to 60', () => {
    setOpacity(60);
    expectOpacity(60);
    expectToggleButton(60);
  });

  it('slider: set opacity to 100', () => {
    setOpacity(100);
    expectOpacity(100);
    expectToggleButton(100);
  });

});

describe.skip('test: glyph opacity toggle button', () => {
  it('toggle: clicking on button should set opacity to 0', () => {
    cy.get('#toggle-glyph-opacity').click();
    expectToggleButton(0);

  });

  it('toggle: after slider set opacity to 30', () => {
    setOpacity(30);
    expectOpacity(30);
    expectToggleButton(30);

    cy.get('#toggle-glyph-opacity').click();
    expectToggleButton(100);
  });
});
