import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginHelpers } from "./login.helper";

Given('I open shop', () => {
    cy.visit(Cypress.config().baseUrl);
    cy.url().should('include', cy.config().baseUrl);
})

When('I login', () => {
    // cy.get('nav a[href="/login"]').click();
    // cy.get('#email').type('jane@example.com');
    // cy.get('#password').type('123456');
    // cy.get('form button.btn-primary').click();
    loginHelpers.apiLogin();
})

Then('I verify the login is successful', () => {
    cy.get('#username').should('be.visible');
})

