import 'dotenv/config';
import { createServer } from '@mswjs/http-middleware';
import * as seeders from './seeders/index.js';
import getApiRoutes from './utilities/file-scan.js';
import serverPage from './utilities/server-page.js';
import logPage from './utilities/log-page.js';
import { deleteLogs } from './utilities/logger.js';
import { env } from './utilities/env.js';

const { apiHandlers, apiRoutes } = await getApiRoutes();

const httpServer = createServer(
    ...apiHandlers,
    ...serverPage(apiRoutes),
    ...logPage(),
);

// Delete any logs on server start if the DELETE_LOGS_ON_SERVER_RESTART env var is set to 'ON'
if (process.env?.DELETE_LOGS_ON_SERVER_RESTART?.toUpperCase() === 'ON') {
    deleteLogs();
}

// Set up the server to listen on the specified port
httpServer.listen(env.SERVER_PORT);

// Execute dB seeder functions
for (const seeder of Object.values(seeders)) {
    seeder();
}

console.log('\n*****************************************************');
console.log(`SERVER UP AND RUNNING ON LOCALHOST:${env.SERVER_PORT}`);
console.log('*****************************************************');
