import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import { z } from 'zod';
import { getApiEndpoints } from './get-all-endpoints.js';
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
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('Local Mock API MCP Server running on stdio');
}
main().catch((error) => {
	console.error('Fatal error in main():', error);
	process.exit(1);
});
