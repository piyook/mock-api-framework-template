import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../models/db.js';
import { prefix } from '../../utilities/env.js';

type UserParams = {
	id: string;
};

type CreateUserBody = {
	userId?: string;
	title?: string;
	body?: string;
};

type UpdateUserBody = {
	title?: string;
	body?: string;
};

function registerUserRoutes(app: FastifyInstance, _pathName: string) {
	const basePath = `/${prefix}users`;

	// GET /users - list all users
	app.get(basePath, async (_request: FastifyRequest, reply: FastifyReply) => {
		const users = db.user.getAll();
		reply.send(users);
	});

	// GET /users/:id - get a single user
	app.get(
		`${basePath}/:id`,
		async (
			request: FastifyRequest<{ Params: UserParams }>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;

			const user = db.user.findFirst({
				where: {
					id: {
						equals: id,
					},
				},
			});

			if (!user) {
				reply.code(404).send({ error: 'User not found' });
				return;
			}

			reply.send(user);
		},
	);

	// POST /users - create a new user
	app.post(
		basePath,
		async (
			request: FastifyRequest<{ Body: CreateUserBody }>,
			reply: FastifyReply,
		) => {
			const { userId, title, body } = request.body ?? {};

			const newUser = db.user.create({
				userId,
				title,
				body,
			});

			reply.code(201).send(newUser);
		},
	);

	// PUT /users/:id - update an existing user (replace fields)
	app.put(
		`${basePath}/:id`,
		async (
			request: FastifyRequest<{
				Params: UserParams;
				Body: UpdateUserBody;
			}>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;
			const { title, body } = request.body ?? {};

			const updated = db.user.update({
				where: {
					id: {
						equals: id,
					},
				},
				data: {
					title,
					body,
				},
			});

			if (!updated) {
				reply.code(404).send({ error: 'User not found' });
				return;
			}

			reply.send(updated);
		},
	);

	// DELETE /users/:id - delete a user
	app.delete(
		`${basePath}/:id`,
		async (
			request: FastifyRequest<{ Params: UserParams }>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;

			const deleted = db.user.delete({
				where: {
					id: {
						equals: id,
					},
				},
			});

			if (!deleted) {
				reply.code(404).send({ error: 'User not found' });
				return;
			}

			reply.code(204).send();
		},
	);
}

export default registerUserRoutes;
