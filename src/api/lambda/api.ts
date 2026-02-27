import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { handler as demoHandler } from '../../lambdas/test-lambda';
import { requestToApiGatewayProxyEvent } from '../../utilities/aws-apigw-convert.js';

// Add any http handler here (get, push , delete etc., and middleware as needed)

type LambdaQuery = {
	type?: string;
};

function registerLambdaRoutes(app: FastifyInstance, pathName: string) {
	app.get(
		`/${pathName}`,
		async (
			request: FastifyRequest<{ Querystring: LambdaQuery }>,
			reply: FastifyReply,
		) => {
			const { type } = request.query;
			console.log(`starting ${pathName}`);
			console.log('Item Type is', type);
			reply.send({
				response: `this is a GET test response from ${pathName}`,
			});
		},
	);

	// Make POST requests to this route with the JSON body data with {"userQuestion": "some test text"} to test
	app.post(
		`/${pathName}`,
		async (
			request: FastifyRequest<{ Body: unknown }>,
			reply: FastifyReply,
		) => {
			const event = await requestToApiGatewayProxyEvent(request);
			const result = await demoHandler(event);
			reply.code(result.statusCode).send(JSON.parse(result.body));
		},
	);
}

export default registerLambdaRoutes;
