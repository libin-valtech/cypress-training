describe('Login', () => {

  it('login to app', () => {
    cy.visit(Cypress.config().baseUrl);
    cy.url().should('include', cy.config().baseUrl);
    cy.get('nav a[href="/login"]').click();
    cy.get('#email').type('jane@example.com');
    cy.get('#password').type('123456');
    cy.get('form button.btn-primary').click();
    cy.get('#username').should('be.visible');
  });

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

