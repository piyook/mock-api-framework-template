import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../models/db.js';
import { prefix } from '../../utilities/env.js';

type PostParams = {
	id: string;
};

type CreatePostBody = {
	id?: number;
	userId: number;
	title: string;
	body: string;
};

type UpdatePostBody = {
	title?: string;
	body?: string;
};

function registerPostRoutes(app: FastifyInstance, _pathName: string) {
	const basePath = `/${prefix}posts`;

	// GET /posts - list all posts
	app.get(basePath, async (_request: FastifyRequest, reply: FastifyReply) => {
		const posts = db.post.getAll();
		reply.send(posts);
	});

	// GET /posts/:id - get a single post
	app.get(
		`${basePath}/:id`,
		async (
			request: FastifyRequest<{ Params: PostParams }>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;

			const post = db.post.findFirst({
				where: {
					id: {
						equals: Number(id),
					},
				},
			});

			if (!post) {
				reply.code(404).send({ error: 'Post not found' });
				return;
			}

			reply.send(post);
		},
	);

	// POST /posts - create a new post
	app.post(
		basePath,
		async (
			request: FastifyRequest<{ Body: CreatePostBody }>,
			reply: FastifyReply,
		) => {
			const { id, userId, title, body } = request.body;

			const newPost = db.post.create({
				id,
				userId,
				title,
				body,
			});

			reply.code(201).send(newPost);
		},
	);

	// PUT /posts/:id - update an existing post
	app.put(
		`${basePath}/:id`,
		async (
			request: FastifyRequest<{
				Params: PostParams;
				Body: UpdatePostBody;
			}>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;
			const { title, body } = request.body ?? {};

			const updated = db.post.update({
				where: {
					id: {
						equals: Number(id),
					},
				},
				data: {
					title,
					body,
				},
			});

			if (!updated) {
				reply.code(404).send({ error: 'Post not found' });
				return;
			}

			reply.send(updated);
		},
	);

	// DELETE /posts/:id - delete a post
	app.delete(
		`${basePath}/:id`,
		async (
			request: FastifyRequest<{ Params: PostParams }>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;

			const deleted = db.post.delete({
				where: {
					id: {
						equals: Number(id),
					},
				},
			});

			if (!deleted) {
				reply.code(404).send({ error: 'Post not found' });
				return;
			}

			reply.code(204).send();
		},
	);
}

export default registerPostRoutes;

// To test localhost:9090/api/posts - to see all posts
// to add post send POST request to localhost:9090/posts with body {"userId": 101, "title": "new post title", "body": "new post body"}
// to check its been added visit localhost:9090/posts/101
