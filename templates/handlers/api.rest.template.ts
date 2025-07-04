// // Copy and save as api.ts in the api path folder in your project using the correct path to models dir
import { db } from '../../src/models/db.js';
import { env } from '../../src/utilities/env.js';

// Example of msw data auto REST handler generation
function handler(pathName: string) {
    console.log(`Generating REST handlers for path: ${pathName}`);
    // Need to add a prefix here for automatic REST handler generation to a specific path
    const prefix = env?.USE_API_URL_PREFIX ? '/' + env.USE_API_URL_PREFIX : '';

    // This will generate all REST handlers for the /api/posts path - GET, POST, PUT and DELETE
    return [...db.post.toHandlers('rest', prefix)];
}

export default handler;

// To test localhost:9090/api/posts - to see all posts
// to add post send POST request to localhost:8000/api/posts with body {"userId": 101, "title": "new post title", "body": "new post body"}
// to check its been added visit localhost:8000/api/posts/101
