import type { DefaultBodyType, StrictRequest } from 'msw';
import type { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Converts a Express JS / MSW request object to a mock AWS API Gateway Proxy Event object.
 * For use when mocking AWS Lamda function that accept an AWS API Gateway Proxy Event
 *
 * @param {StrictRequest<DefaultBodyType>} request - The request object to convert.
 * @return {Promise<APIGatewayProxyEvent>} - The mock AWS API Gateway Proxy Event object.
 */
const requestToApiGatewayProxyEvent = async (
    request: StrictRequest<DefaultBodyType>,
) => {
    // On aws its JSON.parse (event.body) to get the body as an object

    const extractBodyPayload = async () => {
        return JSON.stringify(await request.json());
    };

    const extractQueryStringParameters = async () => {
        const url = new URL(request.url);
        const urlParamsEntries = url.searchParams.entries();
        return Object.fromEntries(urlParamsEntries);
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
