import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
    return [
        http.get(`/${pathName}/:videoID`, ({ request }) => {
            const url = new URL(request.url);
            const params = url.pathname.split('/').pop();

            console.log(`starting ${pathName}`);

            const buffer = fs.readFileSync(
                path.resolve(`./src/media/videos/${params}`),
            );

            return HttpResponse.arrayBuffer(buffer, {
                headers: {
                    'Content-Type': 'video/mp4',
                },
            });
        }),
    ];
}

export default handler;
