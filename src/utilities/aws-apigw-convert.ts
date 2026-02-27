import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { FastifyRequest } from 'fastify';

/**
 * Converts a Fastify request object to a mock AWS API Gateway Proxy Event object.
 * For use when mocking AWS Lamda function that accept an AWS API Gateway Proxy Event
 *
 * @param {FastifyRequest} request - The request object to convert.
 * @return {Promise<APIGatewayProxyEvent>} - The mock AWS API Gateway Proxy Event object.
 */
const requestToApiGatewayProxyEvent = async (request: FastifyRequest) => {
	// On aws its JSON.parse (event.body) to get the body as an object

	const extractBodyPayload = async () => {
		try {
			return JSON.stringify(request.body ?? {});
		} catch {
			throw new Error('Invalid Payload : must contain a body property');
		}
	};

	const extractQueryStringParameters = async () => {
		const query = request.query as Record<string, unknown> | undefined;
		if (!query) return {};

		const out: Record<string, string> = {};
		for (const [key, value] of Object.entries(query)) {
			if (typeof value === 'string') out[key] = value;
		}
		return out;
	};

	/*
        Returns an object similar to the AWS API Gateway Proxy Event object containing the body and query string parameters extracted from the request.
        body is accessed as event.body and JSON.parse is used to parse the body as an object.
        queryStringParameters are accessed via queryStringParameters.name where name is the property key in the object.
    */

	return {
		queryStringParameters: await extractQueryStringParameters(),
		body: await extractBodyPayload(),
	} as unknown as APIGatewayProxyEvent;
};

export { requestToApiGatewayProxyEvent };
