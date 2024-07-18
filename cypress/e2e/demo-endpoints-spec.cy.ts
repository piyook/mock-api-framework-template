import exp from 'constants';
import { response } from 'express';

const catsSchema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'array',
    items: [
        {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                type: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                starSign: {
                    type: 'string',
                },
            },
            required: ['id', 'type', 'name', 'starSign'],
        },
        {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                type: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                starSign: {
                    type: 'string',
                },
            },
            required: ['id', 'type', 'name', 'starSign'],
        },
        {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                type: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                starSign: {
                    type: 'string',
                },
            },
            required: ['id', 'type', 'name', 'starSign'],
        },
        {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                type: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                starSign: {
                    type: 'string',
                },
            },
            required: ['id', 'type', 'name', 'starSign'],
        },
    ],
};

describe('Cats demo endpoint contains expected information', () => {
    it('checks server is running and serving data', () => {
        cy.request('/api/cats').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).length.to.be.greaterThan(0);
        });
    });

    it('should validate returned JSON against schema', () => {
        cy.request('GET', '/api/cats').then((response) => {
            expect(response.body).to.be.jsonSchema(catsSchema);
        });
    });
});

describe('Bikes demo endpoint contains expected information', () => {
    it('checks server is running and serving data from GET requests with no url params', () => {
        cy.request('GET', '/api/bikes').then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body).to.deep.equal({
                response:
                    'this is a GET test response from api/bikes for bike type: none',
            });
        });
    });

    it('checks server is running and serving data from GET requests with url params', () => {
        cy.request('GET', '/api/bikes?type=KawasakiNinja').then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body).to.deep.equal({
                response:
                    'this is a GET test response from api/bikes for bike type: KawasakiNinja',
            });
        });
    });

    it('checks server is running and serving data from POST requests', () => {
        cy.request('POST', '/api/bikes', {
            id: 6,
            userId: 'Mario',
            title: 'Favourite Bike',
            body: '{favouriteBike: "Kawasaki Ninja"}',
        }).then((response) => {
            expect(response.status).to.eq(200);
            cy.log(response.body);

            expect(response.body).to.deep.equal({
                response:
                    'this is a POST test response from api/bikes with bodyData {"id":6,"userId":"Mario","title":"Favourite Bike","body":"{favouriteBike: \\"Kawasaki Ninja\\"}"}',
            });
        });
    });
});

describe('Images demo endpoint contains expected information', () => {
    it('checks image endpoint is running', () => {
        cy.visit('/api/images');
        cy.get('h4').contains(
            'Access images stored in the src/resources/images folder using the format:',
        );
        cy.get('h4').contains('Example: api/images/placeholder.png');
    });
    it('checks placeholder image demo endpoint is running', () => {
        cy.request('/api/images/placeholder.png').then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

describe('Videos demo endpoint contains expected information', () => {
    it('checks image endpoint is running', () => {
        cy.visit('/api/videos');
        cy.get('h4').contains(
            'Access videos stored in the src/resources/videos folder using the format:',
        );
        cy.get('h4').contains('Example: api/videos/placeholder.mp4');
    });
    it('checks placeholder image demo endpoint is running', () => {
        cy.request('/api/videos/placeholder.mp4').then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

describe('Markdown demo endpoint contains expected information', () => {
    it('checks markdown endpoint is running', () => {
        cy.visit('/api/markdown');
        cy.get('h4').contains(
            'Access markdown files stored in the src/resources/markdown folder using the format:',
        );
        cy.get('h4').contains('Example: api/markdown/demo');
    });
    it('checks placeholder image demo endpoint is running', () => {
        cy.visit('/api/markdown/demo');
        cy.get('h1').contains('This is a test markdown file');
        cy.get('h2').contains('Add files into the src/markdown directory');
    });
});
