import 'dotenv/config';
import { createServer } from '@mswjs/http-middleware';
import * as seeders from './seeders/index.js';
import getApiPaths from './utilities/file-scan.js';
import serverPage from './utilities/server-page.js';
import { env } from './utilities/env.js';

const { apiHandlers, apiPaths } = await getApiPaths();

const httpServer = createServer({}, ...apiHandlers, ...serverPage(apiPaths));

httpServer.listen(env.SERVER_PORT);

// Execute dB seeder functions
for (const seeder of Object.values(seeders)) {
    seeder();
}

console.log(`SERVER UP AND RUNNING ON LOCALHOST:${env.SERVER_PORT}`);
