import { createServer } from "@mswjs/http-middleware";
import { handlers } from "./mocks/handlers.js";

const httpServer = createServer(...handlers);

httpServer.listen(9090);
