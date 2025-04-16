import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type HttpHandler } from 'msw';
import { prefix } from './env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ApiFile = Promise<{
    default: (pathName: string) => HttpHandler[];
}>;

export default async function getApiRoutes() {
    const apiRootDirectoryPath = `${__dirname}/../api`;

    const apiFileImportPromises: ApiFile[] = [];
    const apiHandlers: HttpHandler[] = [];
    const apiRoutes: string[] = [];

    const apiDirectories = fs.readdirSync(apiRootDirectoryPath);

    for (const directory of apiDirectories) {
        const filePath = path.join(apiRootDirectoryPath, directory);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            console.log(
                `Found folder in src/api: Adding New Route ${prefix}${directory}`,
            );
            // Add directory/route name to list of api paths
            apiRoutes.push(directory);

            // Import the api.ts file (assuming it's in each directory) - this returns a promise
            try {
                const importPromise = import(
                    `file://${path.join(filePath, 'api.ts')}`
                ) as ApiFile;
                // Add new import promises to array of promises to be used by promise.all below
                apiFileImportPromises.push(importPromise);
            } catch (error) {
                console.error('Error importing api.ts file:', error);
            }
        }
    }

    /* Return a promise.all to resolve when all promises resolve that will each themselves return the file 
    with a default import (api handlers function) that can be imported with the api path */
    return Promise.all(apiFileImportPromises)
        .then((files) => {
            for (const [index, file] of files.entries()) {
                /* Add new handlers with the desired apiPath to return array - remember to spread these out as may be 
                more than one handler in return array */
                apiHandlers.push(
                    ...file.default(`${prefix}${apiRoutes[index]}`),
                );
            }
        })
        .then(() => {
            // When all are resolved then return the handlers and paths
            return { apiHandlers, apiRoutes };
        });
}
