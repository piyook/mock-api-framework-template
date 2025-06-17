import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getApiEndpoints } from './helpers/get-all-endpoints.js';
import { addApiEndpoint } from './helpers/add-api-endpoint.js';
import { apiHandlerExample } from './data/api-handler-example.js';
import {
	startMockServer,
	stopMockServer,
	rebuildMockServer,
} from './helpers/control-mock-server.js';
import path from 'path';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change this to the port you want to use for your local mock API server
const PORT = 8000;

// Create server instance
const server = new McpServer({
	name: 'MCP Local Mock API Server',
	version: '1.0.0',
	capabilities: {
		resources: {},
		tools: {},
	},
});

server.tool(
	'create_new_api_endpoint',
	`create new api endpoint for the local mock API server using the supplied standard code format as a basis for the new api code. 
	Args:
	- action: get_code_format (gets standard code format) or add_endpoint(creates new api endpoint using supplied code)
	- name: Name of the API endpoint (only required for add_endpoint action)
	- description: Description of the API endpoint (only required for add_endpoint action)
	- code: Code for the API endpoint (should be a valid TypeScript file content following the format described in the get_code_format request )`,
	{
		action: z.enum(['add_endpoint', 'get_code_format']),
		name: z.string().min(1, 'Name is required').optional(),
		description: z.string().min(1, 'Description is required').optional(),
		code: z.string().min(1, 'Code is required').optional(),
	},
	async (input) => {
		const { action, name, description, code } = input;

		switch (action) {
			case 'get_code_format':
				// Return the format for API endpoint code generation
				return {
					content: [
						{
							type: 'text',
							text: `API endpoint code needs to follow the format in the example below:
									${apiHandlerExample()}
									This is a TypeScript file that exports a function that returns an array of HTTP handlers.
									Create new API endpoint code using a similar pattern.`,
						},
					],
				};

			case 'add_endpoint':
				// Handle the 'add' action to add a new API endpoint
				if (!name || !description || !code) {
					return {
						content: [
							{
								type: 'text',
								text: 'Name, description, and code are required for adding a new API endpoint.',
							},
						],
					};
				}
				const result = await addApiEndpoint(name, description, code);
				return {
					content: [
						{
							type: 'text',
							text: result,
						},
					],
				};

			default:
				return {
					content: [
						{
							type: 'text',
							text: 'Invalid action specified. Use "get_endpoints", "start_server", "stop_server", "rebuild_server`or "add_endpoint".',
						},
					],
				};
		}
	},
);

server.tool(
	'manage_local_mock_api_server',
	`Manage the local mock server on localhost running in Docker (Docker must be installed and running). 	
	Args:
	action: one of the following actions: 
		get (gets all available api endpoints), 
		start (starts server), 
		stop (stops server), 
		rebuild (rebuild server to register new code changes) 
		`,
	{
		action: z.enum(['get', 'start', 'stop', 'rebuild']),
	},
	async (input) => {
		const { action } = input;

		switch (action) {
			case 'get':
				return {
					content: [
						{
							type: 'text',
							text: await getApiEndpoints(PORT),
						},
					],
				};

			case 'start':
				return {
					content: [
						{
							type: 'text',
							text: await startMockServer(PORT),
						},
					],
				};

			case 'stop':
				return {
					content: [
						{
							type: 'text',
							text: await stopMockServer(PORT),
						},
					],
				};

			case 'rebuild':
				return {
					content: [
						{
							type: 'text',
							text: await rebuildMockServer(PORT),
						},
					],
				};
			default:
				return {
					content: [
						{
							type: 'text',
							text: 'Invalid action specified. Use "get_endpoints", "start_server", "stop_server", "rebuild_server`or "add_endpoint".',
						},
					],
				};
		}
	},
);

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('Local Mock API MCP Server running on stdio');
}
main().catch((error) => {
	console.error('Fatal error in main():', error);
	process.exit(1);
});
