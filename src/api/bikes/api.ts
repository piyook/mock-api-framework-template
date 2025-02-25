import { http, HttpResponse } from 'msw';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
    console.log('bikes path');
    return [
        http.get(`/${pathName}`, ({ request }) => {
            const url = new URL(request.url);
            const type = url.searchParams.get('type');
            console.log(`starting ${pathName}`);
            console.log('Item Type is', type);
            return HttpResponse.json({
                response: `this is a GET test response from ${pathName} for bike type: ${type ?? 'none'}`,
            });
        }),
        http.post(`/${pathName}`, async ({ request }) => {
            // Get Body Data using json(), text() or formData() depending on what is sent
            const bodyData = await request.json();
            return HttpResponse.json({
                response: `this is a POST test response from ${pathName} with bodyData ${JSON.stringify(bodyData)}`,
            });
        }),
    ];
}

export default handler;
