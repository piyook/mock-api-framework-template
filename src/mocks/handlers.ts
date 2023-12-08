import { http, HttpResponse } from "msw";
/* @ts-ignore : module refers to this module triggers ts error*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("../data/data.json");

export const handlers = [
  http.get("/user", () => {
    return HttpResponse.json(data);
  }),
];
