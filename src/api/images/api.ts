import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
    return [
        http.get(`/${pathName}`, ({ request }) => {
            return HttpResponse.text(
                `<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access images stored in the src/media/images folder using the format: <span style="color:red">api/images/{filename}</span></h4>
                <h4>Example: api/images/placeholder.png</h4>
                </div>
                </body>
                `,
                {
                    headers: {
                        'Content-Type': 'text/html',
                    },
                },
            );
        }),
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
