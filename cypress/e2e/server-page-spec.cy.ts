describe('Server page contains expected information', () => {
    it('passes', () => {
        const expectedEndpoints = [
            '/api/bikes',
            '/api/cats',
            '/api/images',
            '/api/json',
            '/api/lambda',
            '/api/markdown',
            '/api/posts',
            '/api/users',
            '/api/videos',
        ];
        cy.visit('/');
        cy.get('h1').contains('Running');

        cy.get('h3').contains('Server Address');
        cy.get('h3').contains('Server Port');
        cy.get('h3').contains('Server URL Prefix');
        cy.get('h3').contains('API endpoints');

        cy.get('[cy-data="server_address"]').contains('localhost');
        cy.get('[cy-data="server_port"]').contains('8000');
        cy.get('[cy-data="url_prefix"]').contains('api');

        const endpoints = cy.get('[cy-data="endpoint"]');

        endpoints.should('have.length', expectedEndpoints.length);

        endpoints.each((endpoint) => {
            expect(expectedEndpoints).to.include(endpoint.text());
        });
    });
});
