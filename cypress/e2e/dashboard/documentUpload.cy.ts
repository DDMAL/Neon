beforeEach(() => {
    cy.visit('http://localhost:8080/dashboard.html');
});



export function uploadSingleFolio(): void {
    cy.get('#upload-new-doc-button').click(); 
    cy.get('#neon-modal-window').should('be.visible');

    cy.get('#initial_upload_area')
        .attachFile('253rvSOOMR.mei', { subjectType: 'drag-n-drop' });

    cy.get('#initial_upload_area')
        .attachFile('Einsiedeln__Stiftsbibliothek__Codex_611_253r.jpg', { subjectType: 'drag-n-drop' });


    cy.get('#mei_list > .unpaired_item_container > .unpaired_item_radio').first()
        .invoke('attr', 'value').should('eq', '253rvSOOMR.mei');

    cy.get('#image_list > .unpaired_item_container > .unpaired_item_radio').first()
        .invoke('attr', 'value').should('eq', 'Einsiedeln__Stiftsbibliothek__Codex_611_253r.jpg');


    makeFolioPair();
    uploadFolio();
}


function makeFolioPair(): void {
    cy.get('#mei_list > .unpaired_item_container > .unpaired_item_radio').first().click();
    cy.get('#image_list > .unpaired_item_container > .unpaired_item_radio').first().click();

    cy.get('#make_pair').click();

    cy.get('#paired_list > .tile_item').first()
        .invoke('attr', 'mei').should('eq', '253rvSOOMR.mei');

    cy.get('#paired_list > .tile_item').first()
        .invoke('attr', 'image').should('eq', 'Einsiedeln__Stiftsbibliothek__Codex_611_253r.jpg');
}

function uploadFolio(): void {
    cy.get('#upload_button').click();

    cy.get('#neon-modal-window').should('not.be.visible');
    cy.get('#uploaded-docs-content > .document-entry.uploaded-doc > .filename-text').first()
        .should('contain', '253rvSOOMR');
}


describe('Document Upload Test', () => {

    it('Upload single MEI document', () => {
        uploadSingleFolio();
    });

});