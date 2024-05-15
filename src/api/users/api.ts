import { db } from '../../models/db.js';

// Example of msw data auto REST handler generation
function handler(pathName: string) {
    return [...db.user.toHandlers('rest')];
}

export default handler;
