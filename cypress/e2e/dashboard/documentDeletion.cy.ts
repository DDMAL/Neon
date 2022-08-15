import { uploadSingleFolio } from './documentUpload.cy'



describe('Document Deletion Test', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8080/dashboard.html');
        uploadSingleFolio();
    
    });


    it('Deletes a single user-uploaded folio', () => {
        cy.get('.document-entry.uploaded-doc').should('have.length', 1);

        cy.get('.document-entry.uploaded-doc').first().click();
        cy.get('#remove-doc').should('have.class', 'active');
        cy.get('#remove-doc').click()
        cy.get('#remove-doc').should('not.have.class', 'active')

        
        cy.get('.document-entry.uploaded-doc').should('have.length', 0);
    });
});