import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type ErrorQuery = {
	status?: string;
	message?: string;
};

function registerErrorRoutes(app: FastifyInstance, pathName: string) {
	app.get(
		`/${pathName}`,
		async (
			request: FastifyRequest<{ Querystring: ErrorQuery }>,
			reply: FastifyReply,
		) => {
			const { status, message } = request.query;

			const statusCode = Number.parseInt(status ?? '404', 10);
			const errorMessage = message ?? 'Not Found';

			reply.code(statusCode).send({
				error: `${statusCode}: ${errorMessage}`,
			});
		},
	);
}

export default registerErrorRoutes;
