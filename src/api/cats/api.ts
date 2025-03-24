import { http, HttpResponse } from 'msw';
import { db } from '../../models/db.js';

function handler(pathName: string) {
    return [
        // Get all cats
        http.get(`/${pathName}`, ({ request }) => {
            const url = new URL(request.url);
            const type = url.searchParams.get('type');
            console.log(`starting ${pathName}`);
            console.log('Item Type is', type);

            const cats = db.cat.getAll();
            return HttpResponse.json(cats);
        }),
        // Get cat by id
        http.get(`/${pathName}/:id`, ({ params }) => {
            const id = params.id;

            if (id) {
                console.log(`starting ${pathName}/${id.toString()}`);

                const cats = db.cat.findFirst({
                    where: {
                        id: {
                            equals: Number(id),
                        },
                    },
                });
                return HttpResponse.json(cats);
            }

            return HttpResponse.error();
        }),
    ];
}

export default handler;
