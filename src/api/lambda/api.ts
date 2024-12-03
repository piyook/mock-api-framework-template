import { http, HttpResponse } from 'msw';
import { handler as demoHandler } from '../../lambdas/test-lambda';
import { requestToApiGatewayProxyEvent } from '../../utilities/aws-apigw-convert.js';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
    return [
        http.get(`/${pathName}`, ({ request }) => {
            const url = new URL(request.url);
            const type = url.searchParams.get('type');
            console.log(`starting ${pathName}`);
            console.log('Item Type is', type);
            return HttpResponse.json({
                response: `this is a GET test response from ${pathName}`,
            });
        }),
        // Make POST requests to this route with the JSON body data with {"userQuestion": "some test text"} to test
        http.post(`/${pathName}`, async ({ request }) => {
            const event = await requestToApiGatewayProxyEvent(request);
            return HttpResponse.json(await demoHandler(event));
        }),
    ];
}

export default handler;
