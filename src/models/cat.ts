import { faker } from '@faker-js/faker';

faker.seed();

export type Cat = {
	id: number;
	type: string;
	name: string;
	starSign: string;
};

export function makeCat(partial: Partial<Cat> = {}): Cat {
	return {
		id: partial.id ?? faker.number.int({ min: 1, max: 1_000_000 }),
		type: partial.type ?? faker.animal.cat(),
		name: partial.name ?? faker.person.firstName(),
		starSign: partial.starSign ?? faker.person.zodiacSign(),
	};
}
