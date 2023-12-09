import { http, HttpResponse } from "msw";
/* @ts-ignore : module refers to this module triggers ts error*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// const data = require("../data/data.json");
import { db } from "../models/db.js";

// put http://localhost:9090/user?startDate=test
export const handlers = [
  /* 
    Manually handle paths and responses 
  */
  http.get("/test", ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    console.log("starting");
    console.log("startDate is now", startDate);
    return HttpResponse.json(db.user.getAll());
  }),

  /* OR
      Using the automatic REST creators below
  */
  ...[...db.user.toHandlers("rest"), ...db.post.toHandlers("rest")],
];
