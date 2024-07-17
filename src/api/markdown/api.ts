import fs from 'node:fs';
import path from 'node:path';
import { http, HttpResponse } from 'msw';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
    const md = markdownit({
        html: false,
        highlight(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return (
                        '<pre><code class="hljs">' +
                        hljs.highlight(str, {
                            language: lang,
                            ignoreIllegals: true,
                        }).value +
                        '</code></pre>'
                    );
                } catch {}
            }

            return ''; // Use external default escaping
        },
    }).disable(['link', 'image']);
    return [
        http.get(`/${pathName}`, ({ request }) => {
            return HttpResponse.text(
                `<body style="background-color: #383838; color:white">
                <div style="text-align:center; padding:50px 0px 0px 0px">
                <h4>Access markdown files stored in the src/media/markdown folder using the format: <span style="color:red">api/markdown/{filename}</span></h4>
                <h4>Example: api/markdown/demo</h4>
                </div>
                </body>
                `,
                {
                    headers: {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
        }),
        http.get(`/${pathName}/:mdID`, ({ request }) => {
            const url = new URL(request.url);
            const params = url.pathname.split('/').pop();

            console.log(`starting ${pathName}`);

            try {
                const buffer = fs.readFileSync(
                    path.resolve(`./src/resources/markdown/${params}.md`),
                );
                const result = ` <html>
            <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
            </head>
            <body>
            ${md.render(buffer.toString())}
            </body>
            </html>`;
                return new HttpResponse(result, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            } catch {
                return HttpResponse.text(
                    'Error: File not found. Check file is in the src/resources/markdown folder',
                    {
                        status: 404,
                        headers: {
                            'Content-Type': 'text/html',
                            'Access-Control-Allow-Origin': '*',
                        },
                    },
                );
            }
        }),
    ];
}

export default handler;
