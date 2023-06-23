// // describe('Download file', () => {
// //   it('should download the file', () => {
// //     cy.visit('http://the-internet.herokuapp.com/download');

// //     cy.contains('wp4.jfif').click();

// //     cy.wait(5000); 
// //     cy.readFile('cypress/downloads/wp4.jfif').should('exist');
// //   });
// // });

// describe('Download file', () => {
//   it('should download the file', () => {
//     cy.visit('http://localhost:3000/');

   
//     cy.get('[data-cy="fileDownload"]').click();

  
//     cy.wait(2000); 
//     cy.readFile('cypress/downloads/logoimage.png').should('exist');
//   });
// });



// describe('Upload file', () => {
//   it('should upload the file', () => {
//     cy.visit('http://the-internet.herokuapp.com/upload');

   
//     cy.get('#file-upload').selectFile('cypress/fixtures/sampleFile.jpeg');
//     cy.get('#file-submit').click();
    
//     cy.wait(5000); 
//     cy.get('#uploaded-files').should('be.visible');
//   });
// });



describe('Login to Sauce Demo', () => {
  it('should log in successfully', () => {
    // Visit the Sauce Demo website
    cy.visit('https://www.saucedemo.com/');

    // Enter the username and password
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');

    // Click the login button
    cy.get('#login-button').click();

    // Assert that login was successful and user is redirected to the inventory page
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('have.text', 'Products');
  });
});