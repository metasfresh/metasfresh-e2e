describe('Create a new Pricesystem and new Pricelist', function() {
    before(function() {
      // login before each test
      cy.loginByForm();
    });

    it('Create a new Pricesystem and Pricelist with PLV', function() {
        cy.visit('/window/540320/NEW');
        cy.writeIntoStringField('Name', 'TestPriceSystem');

        cy.get('.form-field-Value')
          .first()
          .find('input')
          .clear()
          .type('TestPriceSystem'); 

    
        cy.visit('/window/540321/NEW');
      
        cy.writeIntoStringField('Name', 'TestPriceList')

        cy.get('.form-field-M_PricingSystem_ID')
          .find('input')
          .type('T');
        cy.get('.input-dropdown-list').should('exist');
        cy.contains('.input-dropdown-list-option', 'TestPriceSystem')
          .click();

        cy.get('.form-field-C_Currency_ID')
          .find('input')
          .type('E');
        cy.get('.input-dropdown-list').should('exist');
        cy.contains('.input-dropdown-list-option','EUR')
          .click();

        cy.pressAddNewButton();
 
        cy.writeIntoStringField('Name','T', true)
          .type('{selectall}{backspace}')
        cy.writeIntoStringField('Name', 'TestPLV', true);
        cy.get('.items-row-2 > .btn')
          .click();
    });    
});