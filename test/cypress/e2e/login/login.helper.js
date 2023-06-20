

export let loginHelpers = {
    apiLogin: function() {
                    cy.request({
                        url: `${cy.config().baseUrl}api/users/login`,
                        method: 'POST',
                        body: {email:"jane@example.com",password:"123456"}
                    }).then((res) => {
                        expect(res.body.email).to.equal('jane@example.com');
                        window.localStorage.setItem('userInfo', JSON.stringify(res.body))
                        cy.reload();
                    });
                }
}