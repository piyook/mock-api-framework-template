describe('Lambda demo endpoint works as expected', () => {
    it('checks server is running and serving data from GET requests', () => {
        cy.request('GET', '/api/lambda').then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body).to.deep.equal({
                response: 'this is a GET test response from api/lambda',
            });
        });
    });

    it('check test Lambda function is working with POST requests', () => {
        cy.request('POST', '/api/lambda', {
            userQuestion: 'THIS IS A USER QUESTION',
        }).then((response) => {
            expect(response.status).to.eq(200);
            cy.log(response.body);

            expect(response.body).to.deep.equal({
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: '{"demoOutput":"this is demo lambda output based on THIS IS A USER QUESTION"}',
            });
        });
    });

    it('check test Lambda function error handling is working with no body data', () => {
        cy.request({
            method: 'POST',
            url: '/api/lambda',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(500);
            expect(response.body).to.contain(
                'Invalid Payload : must contain a userQuestion property',
            );
        });
    });
});
