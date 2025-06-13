import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const addApiEndpoint = async (name, description, code) => {
    if (!name || !description || !code) {
        return 'API Endpoint Not created. Name, description, and handler code are required to create a new API endpoint.';
    }
    // Create path to the endpoint directory
    const endpointDir = path.join(__dirname, '..', `..`, 'api', name);
    const apiPath = path.join(endpointDir, `api.ts`); // or 'index.ts'
    if (fs.existsSync(apiPath)) {
        return `API Endpoint Not created. API endpoint ${name} already exists.`;
    }
    // Create the endpoint directory first
    fs.mkdirSync(endpointDir, { recursive: true });
    // Then create the file inside the directory
    fs.writeFileSync(apiPath, code, 'utf8');
    return `API Endpoint ${name} created successfully at ${apiPath}.`;
};
export { addApiEndpoint };
