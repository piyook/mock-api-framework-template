import { createServer } from "@mswjs/http-middleware";
import { userSeeder, postSeeder } from "./seeders/index.js";
import getApiPaths from "./utilities/file-scan.js";

console.log("HANDLERS:", await getApiPaths());

const httpServer = createServer(...(await getApiPaths()));

httpServer.listen(9090);

userSeeder();
postSeeder();
