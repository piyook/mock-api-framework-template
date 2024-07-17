import { faker } from '@faker-js/faker';
import { primaryKey } from '@mswjs/data';

faker.seed();

export const cat = {
    // ...with these properties and value getters.
    id: primaryKey(Number),
    type: () => faker.animal.cat(),
    name: () => faker.person.firstName(),
    starSign: () => faker.person.zodiacSign(),
};
