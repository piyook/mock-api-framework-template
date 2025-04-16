import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';

function handler(pathName: string) {
    return [
        http.get(`/${pathName}`, ({ request }) => {
            const url = new URL(request.url);

            const statusCode = Number.parseInt(
                url.searchParams.get('status') ?? '404',
                10,
            );

            const errorMessage = url.searchParams.get('message') ?? 'Not Found';

            return HttpResponse.json(
                { error: statusCode + ': ' + errorMessage },
                { status: statusCode },
            );
        }),
    ];
}

export default handler;
