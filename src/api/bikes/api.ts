import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import logger from '../../utilities/logger';

// Add any http handler here (get, push , delete etc., and middleware as needed)

type BikeQuery = {
	type?: string;
};

function registerBikeRoutes(app: FastifyInstance, pathName: string) {
	app.get(
		`/${pathName}`,
		async (
			request: FastifyRequest<{ Querystring: BikeQuery }>,
			reply: FastifyReply,
		) => {
			const { type } = request.query;
			console.log(`starting ${pathName}`);
			console.log('Item Type is', type);

			// Log the request passing the request data, pathName and request type to the logger function
			logger({
				data: { type },
				pathName,
				type: 'GET',
			});

			reply.send({
				response: `this is a GET test response from ${pathName} for bike type: ${type ?? 'none'}`,
			});
		},
	);

	app.post(
		`/${pathName}`,
		async (
			request: FastifyRequest<{ Body: unknown }>,
			reply: FastifyReply,
		) => {
			const bodyData = request.body ?? {};

			// Log the request passing the request data, pathName and extra information to the logger function
			logger({
				data: bodyData,
				type: 'POST',
				pathName,
			});

			reply.send({
				response: `this is a POST test response from ${pathName} with bodyData ${JSON.stringify(bodyData)}`,
			});
		},
	);
}

export default registerBikeRoutes;
