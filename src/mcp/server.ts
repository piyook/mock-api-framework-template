import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getApiEndpoints } from './helpers/get-all-endpoints.js';
import { addApiEndpoint } from './helpers/add-api-endpoint.js';
import { apiHandlerExample } from './data/api-handler-example.js';

// Change this to the port you want to use for your local mock API server
const PORT = 8000;

// Create server instance
const server = new McpServer({
	name: 'Local Mock API Server',
	version: '1.0.0',
	capabilities: {
		resources: {},
		tools: {},
	},
});

// Static resource
server.tool(
	'get_code_format',
	'returns the format to be used for API endpoint code generation to be used with add_localMockAPIEndpoint tool ',
	{},
	() => ({
		content: [
			{
				type: 'text',
				text: `API endpoint code needs to follow the format in the example below:
	  ${apiHandlerExample()}
	  This is a TypeScript file that exports a function that returns an array of HTTP handlers.
	  Create new api endpoint code using a similar pattern.
	  `,
			},
		],
	}),
);

server.tool(
	'get_localMockAPIEndpoints',
	'returns all available API endpoints on local mock API server on localhost',
	{},
	async () => ({
		content: [
			{
				type: 'text',
				text: `localMockAPIEndpoints: ${await getApiEndpoints(PORT)}`,
			},
		],
	}),
);

server.tool(
	'add_localMockAPIEndpoint',
	`adds a new API endpoint to the local mock API server on localhost 
	Args:
	- name: Name of the API endpoint
	- description: Description of the API endpoint
	- code: Code for the API endpoint (should be a valid TypeScript file content following the format described in the get_code_format tool )`,
	{
		name: z.string().min(1, 'Name is required'),
		description: z.string().min(1, 'Description is required'),
		code: z.string().min(1, 'Code is required'),
	},
	async (input) => {
		const { name, description, code } = input;
		const result = await addApiEndpoint(name, description, code);
		return {
			content: [
				{
					type: 'text',
					text: result,
				},
			],
		};
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
