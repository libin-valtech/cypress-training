Feature: This is a feature for login to the shop

    Scenario: Verify login as user
        Given I open shop
        When I login
        Then I verify the login is successful
