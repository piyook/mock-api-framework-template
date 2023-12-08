import { createServer } from "@mswjs/http-middleware";
import { handlers } from "./handlers/handlers.js";

const httpServer = createServer(...handlers);

httpServer.listen(9090);
