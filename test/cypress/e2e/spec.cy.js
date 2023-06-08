describe('Cypress website tour', () => {

  it('visit cypress website', () => {
    cy.visit('https://example.cypress.io');
    cy.contains("type").click();

    cy.url().should('include', '/commands/actions');

    cy.wait(2000);
    cy.get('.action-email').type('hello world');

  })
  
})



// class name selector 
// '.class-name'

// id selector
// '#id-name'

// element selector
// 'input'

// element selector with attributes
// 'input[type="email"]'


// class name selector 
// '.product'

