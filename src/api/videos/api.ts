import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
	return [
		http.get(`/${pathName}`, ({ request: _request }) => {
			return HttpResponse.text(
				`<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access videos stored in the src/resources/videos folder using the format: <span style="color:red">api/videos/{filename}</span></h4>
                <h4>Example: api/videos/placeholder.mp4</h4>
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
		http.get(`/${pathName}/:videoID`, async ({ request }) => {
			const url = new URL(request.url);
			const params = url.pathname.split('/').pop();

			console.log(`starting ${pathName}`);

			try {
				const buffer = fs.readFileSync(
					path.resolve(`./src/resources/videos/${params}`),
				);

				return new HttpResponse(buffer, {
					headers: {
						'Content-Type': 'video/mp4',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch {
				return HttpResponse.text(
					'Error: File not found. Check file is in the src/resources/videos folder',
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
