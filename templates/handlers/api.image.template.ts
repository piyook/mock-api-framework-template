import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

/*  
    Can serve images from src/images using this handler. 
    Make sure a folder called images exists in src/ and that the images are in that folder
    Images accessed with as http://localhost:8000/api/images/placeholder.png where placeholder.png is the name of the image
*/

function handler(pathName: string) {
    return [
        http.get(`/${pathName}/:imageID`, ({ request }) => {
            const url = new URL(request.url);
            const params = url.pathname.split('/').pop();

            console.log(`starting ${pathName}`);

            const buffer = fs.readFileSync(
                path.resolve(`./src/images/${params}`),
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
