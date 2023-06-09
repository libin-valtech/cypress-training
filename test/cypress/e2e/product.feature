Feature: product related scenarios

    Scenario: Go to product detail page
        Given I open shop
        When I login
        Then I verify the login is successful
        When I click on the product with id "648073603099700fa49a8b58"
        Then I am on the product detail page with id "648073603099700fa49a8b58"

    Scenario: Add product to cart
        Given I open shop
        When I login
        Then I verify the login is successful
        When I click on the product with id "<productId>"
        Then I am on the product detail page with id "<productId>"
        Given I change the quantity to "<quantity>"
        When I click on add to cart button
        Then I verify that the product with id "<productId>" is added to cart

        Examples:
            | productId                | quantity | prodctName  |
            | 648073603099700fa49a8b58 | 2        | iphone      |
            | 648073603099700fa49a8b57 | 7        | playstation |

    Scenario: Add multiple products to cart
            Given I open shop
            When I login
            Then I verify the login is successful
            When I add prodcts from file "products"

