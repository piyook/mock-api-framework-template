import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';
import sharp from 'sharp';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
    return [
        http.get(`/${pathName}`, ({ request }) => {
            return HttpResponse.text(
                `<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access images stored in the src/resources/images folder using the format: <span style="color:red">api/images/{filename}</span></h4>
                <h4>Example: api/images/placeholder.png</h4>
                </div>
                </body>
                `,
                {
                    headers: {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
        }),
        http.get(`/${pathName}/:imageID`, async ({ request }) => {
            const url = new URL(request.url);
            const width = url.searchParams.get('width');
            const height = url.searchParams.get('height');
            console.log(`height ${height} and width ${width}`);
            const params = url.pathname.split('/').pop();

            console.log(`starting ${pathName}`);

            try {
                // Convert width and height to integers, if provided
                const resizeOptions: sharp.ResizeOptions = {};
                if (width && height)
                    resizeOptions.width = Number.parseInt(width, 10);
                if (height && width)
                    resizeOptions.height = Number.parseInt(height, 10);

                const inputBuffer = fs.readFileSync(
                    path.resolve(`./src/resources/images/${params}`),
                );
                const resizedImageBuffer = await sharp(inputBuffer)
                    .resize(resizeOptions) // Only applies resize if width/height are present
                    .png()
                    .toBuffer();

                return HttpResponse.arrayBuffer(resizedImageBuffer, {
                    headers: {
                        'Content-Type': 'image/png',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            } catch {
                return HttpResponse.text(
                    'Error: File not found. Check file is in the src/resources/images folder',
                    {
                        status: 404,
                        headers: {
                            'Content-Type': 'text/html',
                            'Access-Control-Allow-Origin': '*',
                        },
                    },
                );
            }
        }),
    ];
}

export default handler;
