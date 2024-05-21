/* eslint-disable import/order  */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createRequire } from 'node:module';
import { db } from '../models/db.js';
import { type Cat } from '../types.js';

const require = createRequire(import.meta.url);
const catData: Cat[] = require('../data/data.json');

export const catSeeder = () => {
    for (const cat of catData) {
        db.cat.create({
            id: cat.id,
            type: cat.type,
            description: cat.description,
            price: cat.price,
        });
    }
};
