/* eslint-disable no-await-in-loop */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type HttpHandler } from 'msw';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ApiFile = {
    default: (pathName: string) => HttpHandler[];
};

export default async function getApiPaths() {
    const apiFolder = `${__dirname}/../api`;

    const apiHandlers: HttpHandler[] = [];
    const apiPaths: string[] = [];

    const files = fs.readdirSync(apiFolder);

    for (const file of files) {
        const filePath = path.join(apiFolder, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // Get the directory name
            console.log(`Api Path: /${file}`);
            apiPaths.push(file);

            // Import index.ts file (assuming it's in each directory)
            try {
                const { default: indexFile } = (await import(
                    `file://${path.join(filePath, 'api.ts')}`
                )) as ApiFile;
                // Add new handlers to return array - remember to spread these out as may be more than one
                apiHandlers.push(...indexFile(file));
                // Do something with the imported file
            } catch (error) {
                console.error('Error importing index.ts file:', error);
            }
        }
    }

    return { apiHandlers, apiPaths };
}
