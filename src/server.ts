import 'dotenv/config';
import { createServer } from '@mswjs/http-middleware';
import { userSeeder, postSeeder } from './seeders/index.js';
import getApiPaths from './utilities/file-scan.js';
import serverPage from './utilities/server-page.js';

const { apiHandlers, apiPaths } = await getApiPaths();

const httpServer = createServer(...apiHandlers, ...serverPage(apiPaths));

httpServer.listen(process.env.SERVER_PORT);

userSeeder();
postSeeder();

console.log(`SERVER UP AND RUNNING ON LOCALHOST:${process.env.SERVER_PORT}`);
