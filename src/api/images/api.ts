import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';
import sharp from 'sharp';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
	return [
		http.get(`/${pathName}`, () => {
			const images = fs.readdirSync('./src/resources/images');
			return HttpResponse.text(
				`<style>a {color: lightblue; text-decoration: none} a:hover {text-decoration: underline}</style>
				<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access images stored in the src/resources/images folder using the format: <span style="color:pink">api/images/{filename}</span></h4>
				<h4>Resize images by adding url paramters E.g placeholder.png?height=500&width=500</h4>
				
				<h4>Get a full list of images as a json object at <a href="/api/images/list">/images/list</a> </h4>
				<h4>Available image files in src/resources/images folder:</h4>
				<div>${images.map((image) => `<p><a href="/api/images/${image}" >${image}</a></p>`).join('')}<div>
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
		http.get(`/${pathName}/list`, () => {
			return HttpResponse.json(
				{
					mediaType: 'image',
					files: fs.readdirSync('./src/resources/images'),
				},
				{},
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

				return new HttpResponse(resizedImageBuffer, {
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
