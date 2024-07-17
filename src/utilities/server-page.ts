import 'dotenv/config';
import { http, HttpResponse } from 'msw';

const prefix = process.env?.USE_API_URL_PREFIX
    ? process.env.USE_API_URL_PREFIX + '/'
    : '';

const homePage = (apiPaths: string[]) => {
    const htmlString = `
        <html>
        <body style="margin: 0px; background-color: #383838; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height:100vh; font-family: sans-serif;">

            <div style="text-align: center; width: 80%;padding:50px; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; color:white">
                <h1 style="padding-bottom: 10px;"> Mock Server: <span class="highlight">Running</span></h1>
                <div class="spacer"></div>

         <div style="text-align:left;width:clamp(650px, 800px, 90%)); ">
                <h3 class="info">Server Address: <span class="highlight" cy-data="server_address">localhost</span> </h3>
                <h3 class="info">Server Port: <span class="highlight" cy-data="server_port">${process.env?.SERVER_PORT?.toUpperCase() ?? 'NONE'}</span> </h3>
                <h3 class="info">Server URL Prefix: <span class="highlight" cy-data="url_prefix">${process.env?.USE_API_URL_PREFIX?.toLowerCase() ?? 'NONE'}</span> </h3>
        
        <h3  class="info">API endpoints*:</h3>
        <div>
     
        ${apiPaths.map((path) => '<h3 class="endpoint"> <a class="highlight endpoint endpoint_link" cy-data="endpoint" href="' + prefix + path + '">/' + prefix + path + '</a></h3>').join('')}

        </div>

        <p class="starred"><small>* Add new api endpoints to the api folder. <br/>For media endpoints include the media name in the url E.g /images/placeholder.png </small></p>

   
        </div>
      
        </body>
             <style> 
            
            .highlight { 
                background-color:#086e3d;
                padding:10px 15px 10px 15px;
                border-radius: 5px;
                font-weight: bold;
                color: white;
                margin-left: 15px;
                opacity:0.8;
            }

            .endpoint_link {
            background-color: #51639a;
              border: 1px solid grey;
        
            }

            .endpoint {
            text-align: left;
            margin: 30px 0px 30px 0px;
            opacity:0.7;
            transition: all 0.5s ease-in-out;
            }

            .endpoint:hover {
                cursor: pointer;
                opacity: 1;
            }

            .info {
                font-weight: bold;
                padding: 10px 0px 10px 0px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .spacer {
                width:100%;
                border-bottom: 1px grey solid;
                margin: 40px 0px 20px 0px;
            }

            .starred {
            text-align: center;
            line-height: 1.5; 
            color:grey; 
            padding-top:50px
            }
            </style>
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
