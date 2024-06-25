import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

function handler(pathName: string) {
    return [
        http.get(`/${pathName}`, ({ request }) => {
            const url = new URL(request.url);
            const type = url.searchParams.get('type');
            console.log(`starting ${pathName}`);
            console.log('Item Type is', type);
            return HttpResponse.text(
                `<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access JSON data stored in the src/data folder using the format: <span style="color:red">api/json/{filename}</span></h4>
                <h4>Example: api/json/demo</h4>
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
        http.get(`/${pathName}/:pilID`, ({ request }) => {
            const url = new URL(request.url);
            const params = url.pathname.split('/').pop();

            console.log(`starting ${pathName}`);

            const data = fs.readFileSync(
                path.resolve(`./src/data/${params}.json`),
            );

            return HttpResponse.arrayBuffer(data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }),
    ];
}

export default handler;
