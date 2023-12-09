import { faker } from "@faker-js/faker";
import { primaryKey } from "@mswjs/data";

export const post = {
  post: {
    id: primaryKey(Number),
    userId: Number,
    title: String,
    body: String,
  },
};
