import { uploadSingleFolio } from './documentUpload.cy';

beforeEach(() => {
    cy.visit('http://localhost:8080/dashboard.html');
});

export function selectFirstDocument() {
    cy.get('.document-entry')
    .first()
    .click()
    .should('have.class', 'selected')
    .should('have.css', 'border', '2px solid rgb(122, 178, 183)');

    cy.get('#open-doc').should('have.class', 'active');
    cy.get('#remove-doc').should('have.class', 'active');

    cy.get('#open-doc').invoke('attr', 'src').should('eq', './Neon-gh/assets/img/open-doc.svg');
    cy.get('#remove-doc').invoke('attr', 'src').should('eq', './Neon-gh/assets/img/remove-doc.svg');
}

export function selectAllDocuments() {
    cy.get('body').type('{meta}', { release: false });
    cy.get('.document-entry').click({ multiple: true });


    cy.get('#open-doc').should('have.class', 'active');
    cy.get('#remove-doc').should('have.class', 'active');
    cy.get('#open-doc').invoke('attr', 'src').should('eq', './Neon-gh/assets/img/open-doc.svg');
    cy.get('#remove-doc').invoke('attr', 'src').should('eq', './Neon-gh/assets/img/remove-doc.svg');
}


describe('Document Selection Test', () => {

    it('Selects a single document.', () => {
        selectFirstDocument();
    });

    it('Selects multiple documents.', () => {
        selectAllDocuments();
    });

});