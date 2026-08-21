beforeEach(() => {
  cy.visitEditor('/editor.html?manifest=test');
});

type OpacityType = 'glyph' | 'bg';

function expectOpacity(type: OpacityType, val: number) {
  if (type === 'glyph') {
    cy.get('#opacitySlider').as('range').should('have.value', val);

    cy.get('svg.neon-container.active-page')
      .should('have.css', 'opacity')
      .and('eq', String(val / 100));

    cy.get('#opacityOutput').should('have.text', String(val));
  } else {
    cy.get('#bgOpacitySlider').as('range').should('have.value', val);

    cy.get('#bgimg')
      .should('have.css', 'opacity')
      .and('eq', String(val / 100));

    cy.get('#bgOpacityOutput').should('have.text', String(val));
  }
}

function expectToggleButton(type: OpacityType, val: number) {
  cy.get(`#toggle-${type}-opacity > .slider-btn-img`)
    .should('have.attr', 'src')
    .and('contain', val === 0 ? 'show-icon' : 'hide-icon');
}

function setOpacity(type: OpacityType, val: number) {
  const sliderId = type === 'glyph' ? '#opacitySlider' : '#bgOpacitySlider';

  cy.get(sliderId).as('range');

  // Re-query the alias between steps rather than chaining off the first
  // action, so a re-render mid-sequence cannot leave us on a detached node.
  cy.get('@range').trigger('mousedown');
  cy.get('@range').invoke('val', val);
  // Zoom slider uses mouseup, but glyph/img opacity uses the change event
  cy.get('@range').trigger('change');
  cy.get('@range').trigger('mouseup');

  expectOpacity(type, val);
  expectToggleButton(type, val);
}

// Click the toggle button for the corresponding opacity type:
// Check opacity value to be set to 0 or 100, as expected
function clickToggle(type: OpacityType) {
  const sliderId = type === 'glyph' ? '#opacitySlider' : '#bgOpacitySlider';
  cy.get(sliderId).as('range');
  cy.get('@range').then(($slider: JQuery<HTMLInputElement>) => {
    const originVal = Number($slider[0].value);
    cy.get(`#toggle-${type}-opacity`).click();
    expectOpacity(type, originVal === 0 ? 100 : 0);
    expectToggleButton(type, originVal === 0 ? 100 : 0);
  });
}

describe('test: glyph opacity', () => {
  it('slider: set opacity to 0', () => setOpacity('glyph', 0));
  it('slider: set opacity to 30', () => setOpacity('glyph', 30));
  it('slider: set opacity to 100', () => setOpacity('glyph', 100));
});

describe.skip('test: glyph opacity toggle button', () => {
  it('toggle: click -> opacity = 0', () => {
    clickToggle('glyph');
  });

  it('toggle: opacity = 30 -> click', () => {
    setOpacity('glyph', 30);
    clickToggle('glyph');
  });

  it('toggle: opacity = 0 -> click', () => {
    setOpacity('glyph', 0);
    clickToggle('glyph');
  });
});

describe('test: bg/image opacity', () => {
  it('slider: set opacity to 0', () => setOpacity('bg', 0));
  it('slider: set opacity to 30', () => setOpacity('bg', 30));
  it('slider: set opacity to 100', () => setOpacity('bg', 100));
});

describe.skip('test: glyph opacity toggle button', () => {
  it('toggle: click -> opacity = 0', () => clickToggle('bg'));

  it('toggle: opacity = 30 -> click', () => {
    setOpacity('bg', 30);
    clickToggle('bg');
  });

  it('toggle: opacity = 0 -> click', () => {
    setOpacity('bg', 0);
    clickToggle('bg');
  });
});
