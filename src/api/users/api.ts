import { db } from '../../models/db.js';
import { prefix } from '../../utilities/env.js';

// Example of msw data auto REST handler generation
function handler(pathName: string) {
    // Need to add a prefix here for automatic REST handler generation to a specific path
    return [...db.user.toHandlers('rest', prefix)];
}

export default handler;
