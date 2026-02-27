import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { prefix } from './env';

const apiList = (app: FastifyInstance, apis: string[] = ['1', '2', '3']) => {
	app.get('/api', async (_request: FastifyRequest, reply: FastifyReply) => {
		const apiPaths = apis.map((path) => `/${prefix}${path}`);
		reply.send(apiPaths);
	});
};

export { apiList };
