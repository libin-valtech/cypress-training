export let loginHelpers = {
   apiLogin: function() {
        const apiRequest = {
            url: 'http://localhost:3000/api/users/login',
            method: 'POST',
            body: {email: 'jane@example.com', password: '123456'}
        };

        cy.request(apiRequest).then(data => {
            window.localStorage.setItem('userInfo', JSON.stringify(data.body))
            cy.reload();
            expect(data.body.email).to.equal('jane@example.com');
        })
   }
}