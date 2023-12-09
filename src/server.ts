import { createServer } from "@mswjs/http-middleware";
import { handlers } from "./handlers/handlers.js";
import { userSeeder, postSeeder } from "./seeders/index.js";

const httpServer = createServer(...handlers);

httpServer.listen(9090);

userSeeder();
postSeeder();
