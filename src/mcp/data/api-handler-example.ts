import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiHandlerExample = () => {
	const filePath = path.join(
		__dirname,
		'../../../templates/handlers/api.custom.template.ts',
	);

	const fileContent = fs.readFileSync(filePath, 'utf8');
	return fileContent;
};

export { apiHandlerExample };
