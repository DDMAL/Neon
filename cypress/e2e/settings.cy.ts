beforeEach(() => {
  cy.visit('http://localhost:8080/editor.html?manifest=test');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

const LOCALSTORAGE_KEY = 'samples/manifests/test.jsonld';

describe('test(settings): highlight', () => {
  it('key: highlight option should change on q/w/e/r/t/y', () => {
    cy.get('body').type('q');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.eq('staff');
    });

    cy.get('body').type('w');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.eq('syllable');
    });

    cy.get('body').type('e');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.eq('neume');
    });

    cy.get('body').type('r');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.eq('layerElement');
    });

    cy.get('body').type('t');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.eq('selection');
    });

    cy.get('body').type('y');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.eq('none');
    });
  });

  it('key: no change if paired with cmd/ctrl', () => {
    // Check cmd/ctrl + r: should refresh the page without a change in highlight option
    cy.get('body').type('{meta}r');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.not.eq('layerElement');
    });

    // Check cmd/ctrl + q:
    cy.get('body').type('{meta}q');
    cy.window().then(win => {
      const settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.not.eq('staff');
    });
  });
});
