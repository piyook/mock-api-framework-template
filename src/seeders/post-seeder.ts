import { db } from "../models/db.js";
import { type Post } from "../types.js";
/* @ts-ignore : module refers to this module triggers ts error*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const postData: Post[] = require("../data/data.json");

export const postSeeder = () => {
  postData.forEach((post) => {
    db.post.create({
      id: post.id,
      userId: post.userId,
      title: post.title,
      body: post.body,
    });
  });
};
