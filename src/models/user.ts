import { faker } from '@faker-js/faker';

faker.seed();

export type User = {
	id: string;
	userId: string;
	title: string;
	body: string;
};

export function makeUser(partial: Partial<User> = {}): User {
	return {
		id: partial.id ?? faker.string.uuid(),
		userId: partial.userId ?? faker.string.uuid(),
		title: partial.title ?? faker.lorem.lines(1),
		body: partial.body ?? faker.lorem.lines(5),
	};
}
