import { factory } from "@mswjs/data";
import { user } from "./user.js";
import { post } from "./post.js";

// Create database model
export const db = factory({ ...user, ...post });
