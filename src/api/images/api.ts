import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
    return [
        http.get(`/${pathName}/:imageID`, ({ request }) => {
            const url = new URL(request.url);
            const params = url.pathname.split('/').pop();

            console.log(`starting ${pathName}`);

            const buffer = fs.readFileSync(
                path.resolve(`./src/media/images/${params}`),
            );

            return HttpResponse.arrayBuffer(buffer, {
                headers: {
                    'Content-Type': 'image/png',
                },
            });
        }),
    ];
}

export default handler;
