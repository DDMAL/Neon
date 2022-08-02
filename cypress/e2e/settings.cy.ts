import { Settings } from '../../src/utils/LocalSettings';

beforeEach(() => {
  cy.visit('http://localhost:8080/editor.html?manifest=test');
  cy.get('#mei_output', { timeout: 10000 }).should('be.visible');
});

const LOCALSTORAGE_KEY = 'samples/manifests/test.jsonld';

describe('test(settings): highlight', () => {
  it.skip('key: no change if paired with cmd/ctrl', () => {
    // Check cmd/ctrl + r: should refresh the page without a change in highlight option
    cy.get('body').type('{meta}r');
    cy.window().then(win => {
      const settings: Settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.not.eq('layerElement');
    });

    // Check cmd/ctrl + q:
    cy.get('body').type('{meta}q');
    cy.window().then(win => {
      const settings: Settings = JSON.parse(win.localStorage.getItem(LOCALSTORAGE_KEY));
      expect(settings.highlightMode).to.not.eq('staff');
    });
  });
});
