import { navigationSelectors } from "./navigation.selectors";

export let navigationHelpers = {
    goToHome: function() {
        cy.get(navigationSelectors.homeLink).click();
        cy.url().should('contain', cy.config().baseUrl);
    }
}