// Tests for zoom
// - Does the viewbox of the SVG match the zoom value?
// - Does the zoom slider work?
// - Does the zoom reset button work?

describe('test: zoom', () => {
  const ORIGIN_VIEWBOX = [0, 0, 4872, 6496];

  beforeEach(() => {
    // Visit the website, and wait until the MEI SVG is visible:
    cy.visit('http://localhost:8080/edit/test.jsonld');
    cy.get('#mei_output', { timeout: 10000 }).should('be.visible');

    expectZoom(100);
  });

  it('zoom: zoom to 200', () => zoomTo(200));
  it('zoom: zoom to 400', () => zoomTo(400));
  it('zoom: zoom to 50', () => zoomTo(50));

  it('zoom: reset button', () => {
    cy.get('#reset-zoom').click();
    expectZoom(100);
  });

  it('zoom: reset button AFTER zoom to 200', () => {
    zoomTo(200);
    cy.get('#reset-zoom').click();
    expectZoom(100);
  });

  /**
   * Zoom to a percentage value, then run `expectZoom` to check
   * viewbox value and zoom output text value
   */
  function zoomTo (val: number) {
    cy.get('#zoomSlider').as('range')
      .trigger('mousedown')
      .invoke('val', val)
      .trigger('mouseup'); // may be "change"

    expectZoom(val);
  }

  /**
   * Function that checks viewbox, slider, and output values to
   * the zoomed in value
   */
  function expectZoom (val = 100) {
    // Check whether the SVG has the correct viewbox values
    cy.get('#svg_group')
      .should('have.attr', 'viewBox')
      .and('eq', ORIGIN_VIEWBOX.map(e => e / (val / 100)).join(' '));

    // Check zoom slider and output values
    cy.get('#zoomSlider').as('range').should('have.value', val);
    cy.get('#zoomOutput').should('contain.text', String(val));
  }
});
