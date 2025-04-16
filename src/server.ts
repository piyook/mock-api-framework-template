import 'dotenv/config';
import { createServer } from '@mswjs/http-middleware';
import * as seeders from './seeders/index.js';
import getApiRoutes from './utilities/file-scan.js';
import serverPage from './utilities/server-page.js';
import { env } from './utilities/env.js';

const { apiHandlers, apiRoutes } = await getApiRoutes();

const httpServer = createServer(...apiHandlers, ...serverPage(apiRoutes));

httpServer.listen(env.SERVER_PORT);

// Execute dB seeder functions
for (const seeder of Object.values(seeders)) {
    seeder();
}

console.log('\n*****************************************************');
console.log(`SERVER UP AND RUNNING ON LOCALHOST:${env.SERVER_PORT}`);
console.log('*****************************************************');
