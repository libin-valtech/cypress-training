import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginHelpers } from "./login.helpers";
import cypress from "cypress";

Given('I open shop', () => {
    cy.visit(Cypress.config().baseUrl);
    cy.url().should('include', cy.config().baseUrl);
})

When('I login', () => {
    cy.login('jane@example.com', '123456');
})

Then('I verify the login is successful', () => {
    cy.get('#username').should('be.visible');
})


When('I login with api', () => {
    loginHelpers.apiLogin();
})

Given('I download a file and verify', () => {
    cy.get('[data-cy="fileDownload"]').click();

    cy.wait(3000);

    cy.readFile('cypress/downloads/logoimage.png').should('exist');
})

Given('I upload a file and verify', () => {
    cy.visit('http://the-internet.herokuapp.com/upload');

    cy.get('#file-upload').selectFile('cypress/fixtures/sampleFile.jpeg');
    cy.get('#file-submit').click();
    cy.get('#uploaded-files').should('be.visible');
})


Given('I read an excel file', () => {
    cy.parseXlsx('cypress/fixtures/excelData.xlsx').then( (excelData) => {

        const sheet1Data = excelData[0].data;

        sheet1Data.forEach(row => {
            row.forEach(col => {
                cy.log(col + "1");
            })
        });
    })
})
