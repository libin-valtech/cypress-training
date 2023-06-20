import { productSelectors } from "./product.selectors";

export let productHelpers = {
    selectProduct: function(productId) {
        cy.get(`[data-cy-value="${productId}"] a`).eq(0).click();
        cy.url().should('contain', `/product/${productId}`);
    },
    addToCart: function() {
        cy.get(productSelectors.affToCartButton).click();
    }
}
