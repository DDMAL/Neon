describe('test: zoom', () => {
  const ORIGIN_VIEWBOX = [0, 0, 4872, 6496];

  function zoomTo(val: number) {
    cy.get('#zoomSlider').as('range')
      .trigger('mousedown')
      .invoke('val', val)
      .trigger('mouseup'); // may be "change"

    cy.get('#svg_group')
      .should('have.attr', 'viewBox')
      .and('eq', ORIGIN_VIEWBOX.map(e => e / (val / 100)).join(' '));

    cy.get('#zoomOutput').should('contain.text', String(val));
  }

  beforeEach(() => {
    cy.visit('http://localhost:8080/edit/test.jsonld');

    // SVG should be visible
    cy.get('#mei_output', { timeout: 10000 }).should('be.visible');

    cy.get('#svg_group')
      .should('have.attr', 'viewBox')
      .and('eq', ORIGIN_VIEWBOX.join(' '));

    cy.get('#zoomOutput').should('contain.text', '100');

  });

  it('zoom: reset button', () => {
    cy.get('#reset-zoom').should('be.visible').click();

    cy.get('#svg_group')
      .should('have.attr', 'viewBox')
      .and('eq', ORIGIN_VIEWBOX.join(' '));

    cy.get('#zoomOutput').should('contain.text', '100');
  });

  it('zoom: zoom to 200', () => zoomTo(200));
  it('zoom: zoom to 400', () => zoomTo(400));
  it('zoom: zoom to 50', () => zoomTo(50));

  it('zoom: reset button AFTER zoom to 200', () => {
    zoomTo(200);

    cy.get('#reset-zoom').click();

    cy.get('#svg_group')
      .should('have.attr', 'viewBox')
      .and('eq', ORIGIN_VIEWBOX.join(' '));

    cy.get('#zoomOutput').should('contain.text', '100');
  });
});
