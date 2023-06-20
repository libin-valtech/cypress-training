import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { productHelpers } from "./product.helper";
import { navigationHelpers } from "../navigation/navigation.helpers";
  
Given('I open shop', () => {
    cy.visit(Cypress.config().baseUrl);
    cy.url().should('include', cy.config().baseUrl);
})

When('I login', () => {
    cy.get('nav a[href="/login"]').click();
    cy.get('#email').type('jane@example.com');
    cy.get('#password').type('123456');
    cy.get('form button.btn-primary').click();
})

Then('I verify the login is successful', () => {
    cy.get('#username').should('be.visible');
})

When('I click on the product with id {string}', (productId) => {
    productHelpers.selectProduct(productId);
})

Then('I am on the product detail page with id {string}', (productId) => {
    cy.url().should('contain', `/product/${productId}`);
})

When('I click on add to cart button', () => {
    productHelpers.addToCart();
})

Then('I verify that the product with id {string} is added to cart', (productId) => {
    cy.get('.navbar-nav a[href="/cart"]').click();
    cy.get(`[data-cy="cartItems"] [data-cy-value="${productId}"]`).should('be.visible');
})


When('I add prodcts from file {string}', (fileName) => {
    cy.fixture(fileName).then(productData => {
        productData.products.forEach((product) => {
            productHelpers.selectProduct(product.id);
            productHelpers.addToCart();
            navigationHelpers.goToHome();
        })
    })
})