import { db } from '../../models/db.js';
import { prefix } from '../../utilities/env.js';

// Example of msw data auto REST handler generation
function handler() {
	// Need to add a prefix here for automatic REST handler generation to a specific path
	return [...db.post.toHandlers('rest', prefix)];
}

export default handler;

// To test localhost:9090/api/posts - to see all posts
// to add post send POST request to localhost:9090/posts with body {"userId": 101, "title": "new post title", "body": "new post body"}
// to check its been added visit localhost:9090/posts/101
