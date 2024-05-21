import 'dotenv/config';
import { http, HttpResponse } from 'msw';

const prefix = process.env?.USE_API_URL_PREFIX
    ? process.env.USE_API_URL_PREFIX + '/'
    : '';

const homePage = (apiPaths: string[]) => {
    const htmlString = `
        <html>
        <body>
        <h3>SERVER RUNNING ON localhost:${process.env.SERVER_PORT} </h3>
        <h3>Active Paths:<h4>
        <div>
        ${apiPaths.map((path) => '<h4>/' + prefix + path).join('</h4>')}
        </div>
        </body>
        </html>
    `;

    return [
        http.get(`/`, () => {
            return new HttpResponse(htmlString, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        }),
    ];
};

export default homePage;
