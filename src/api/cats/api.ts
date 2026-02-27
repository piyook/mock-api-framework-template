import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../models/db.js';

type GetCatsQuery = {
	type?: string;
};

type GetCatParams = {
	id: string;
};

function registerCatRoutes(app: FastifyInstance, pathName: string) {
	// Get all cats
	app.get(
		`/${pathName}`,
		async (
			request: FastifyRequest<{ Querystring: GetCatsQuery }>,
			reply: FastifyReply,
		) => {
			const { type } = request.query;
			console.log(`starting ${pathName}`);
			console.log('Item Type is', type);

			const cats = db.cat.getAll();
			reply.send(cats);
		},
	);

	// Get cat by id
	app.get(
		`/${pathName}/:id`,
		async (
			request: FastifyRequest<{ Params: GetCatParams }>,
			reply: FastifyReply,
		) => {
			const { id } = request.params;

			if (!id) {
				reply.code(400).send({ error: 'Missing id parameter' });
				return;
			}

			console.log(`starting ${pathName}/${id.toString()}`);

			const cat = db.cat.findFirst({
				where: {
					id: {
						equals: Number(id),
					},
				},
			});

			if (!cat) {
				reply.code(404).send({ error: 'Cat not found' });
				return;
			}

			reply.send(cat);
		},
	);
}

export default registerCatRoutes;
