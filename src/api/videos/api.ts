import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
	return [
		http.get(`/${pathName}`, ({ request: _request }) => {
			const videos = fs.readdirSync('./src/resources/videos');
			return HttpResponse.text(
				`<style>a {color: lightblue; text-decoration: none} a:hover {text-decoration: underline}</style>
				<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access videos stored in the src/resources/videos folder using the format: <span style="color:pink">api/videos/{filename}</span></h4>
                <h4>Example: api/videos/placeholder.mp4</h4>
				<h4>Get a full list of videos as a json object at <a href="/api/videos/list">/videos/list</a> </h4>
				<h4>Available video files in src/resources/videos folder:</h4>
				<div>${videos.map((video) => `<a href="/api/videos/${video}">${video}</a></p>`).join('')}<div>
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
					mediaType: 'video',
					files: fs.readdirSync('./src/resources/videos'),
				},
				{},
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
