import fs from 'node:fs';
import path from 'node:path';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type JsonRootQuery = {
	type?: string;
};

type JsonParams = {
	pilID: string;
};

function registerJsonRoutes(app: FastifyInstance, pathName: string) {
	app.get(
		`/${pathName}`,
		async (
			request: FastifyRequest<{ Querystring: JsonRootQuery }>,
			reply: FastifyReply,
		) => {
			const { type } = request.query;
			console.log(`starting ${pathName}`);
			console.log('Item Type is', type);

			const html = `<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access JSON data stored in the src/data folder using the format: <span style="color:red">api/json/{filename}</span></h4>
                <h4>Example: api/json/demo</h4>
                </div>
                </body>
                `;

			reply.header('Content-Type', 'text/html').send(html);
		},
	);

	app.get(
		`/${pathName}/:pilID`,
		async (
			request: FastifyRequest<{ Params: JsonParams }>,
			reply: FastifyReply,
		) => {
			const { pilID } = request.params;

			console.log(`starting ${pathName}`);

			try {
				const data = fs.readFileSync(
					path.resolve(`./src/resources/json/${pilID}.json`),
					'utf-8',
				);

				reply
					.header('Content-Type', 'application/json')
					.header('Access-Control-Allow-Origin', '*')
					.send(data);
			} catch {
				reply
					.code(404)
					.header('Content-Type', 'text/html')
					.header('Access-Control-Allow-Origin', '*')
					.send(
						'Error: File not found. Check JSON file is in the src/data folder',
					);
			}
		},
	);
}

export default registerJsonRoutes;
