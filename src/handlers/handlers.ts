import { http, HttpResponse } from "msw";
/* @ts-ignore : module refers to this module triggers ts error*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("../data/data.json");

// put http://localhost:9090/user?startDate=test
export const handlers = [
  http.get("/user", ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    console.log("starting");
    console.log("startDate is now", startDate);
    return HttpResponse.json(data);
  }),
];
