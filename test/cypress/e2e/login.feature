Feature: This is a feature for login to the shop

    Scenario: Verify login as user
        Given I open shop
        When I login
        Then I verify the login is successful
        
    Scenario: Verify login using api as user
        Given I open shop
        When I login with api
        Then I verify the login is successful
        
    Scenario: Verify file download
        Given I open shop
        Given I download a file and verify

    Scenario: Verify file upload
        Given I upload a file and verify

    Scenario: Read excel file
        Given I read an excel file