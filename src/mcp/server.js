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
	'ManageLocalMockAPIServer',
	`tools to manage the local mock API endpoint server on localhost 
	Args:
	- action: Action to perform on the local mock API server - 
		get_endpoints (gets endpoints), 
		start_server (starts server), 
		stop_server (stops server), 
		rebuild_server (rebuilds server after code changes), 
		add_endpoint (adds endpoint then you need to run rebuild_server action)
	- name: Name of the API endpoint (only required for add_endpoint action)
	- description: Description of the API endpoint (only required for add_endpoint action)
	- code: Code for the API endpoint (should be a valid TypeScript file content following the format described in the get_code_format request )`,
	{
		action: z.enum([
			'get_endpoints',
			'start_server',
			'stop_server',
			'rebuild_server',
			'add_endpoint',
			'get_code_format',
		]),
		name: z.string().min(1, 'Name is required').optional(),
		description: z.string().min(1, 'Description is required').optional(),
		code: z.string().min(1, 'Code is required').optional(),
	},
	async (input) => {
		const { action, name, description, code } = input;
		switch (action) {
			case 'get_endpoints':
				return {
					content: [
						{
							type: 'text',
							text: await getApiEndpoints(PORT),
						},
					],
				};
			case 'start_server':
				return {
					content: [
						{
							type: 'text',
							text: await startMockServer(PORT),
						},
					],
				};
			case 'stop_server':
				return {
					content: [
						{
							type: 'text',
							text: await stopMockServer(PORT),
						},
					],
				};
			case 'rebuild_server':
				return {
					content: [
						{
							type: 'text',
							text: await rebuildMockServer(PORT),
						},
					],
				};
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
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('Local Mock API MCP Server running on stdio');
}
main().catch((error) => {
	console.error('Fatal error in main():', error);
	process.exit(1);
});
