import { http, HttpResponse } from 'msw';
import logger from '../../utilities/logger';

// Add any http handler here (get, push , delete etc., and middleware as needed)

function handler(pathName: string) {
	return [
		http.get(`/${pathName}`, ({ request }) => {
			const url = new URL(request.url);
			const type = url.searchParams.get('type');
			console.log(`starting ${pathName}`);
			console.log('Item Type is', type);

			// Log the request passing the request data, pathName and request type to the logger function
			logger({
				data: { type },
				pathName,
				type: 'GET',
			});

			return HttpResponse.json({
				response: `this is a GET test response from ${pathName} for bike type: ${type ?? 'none'}`,
			});
		}),
		http.post(`/${pathName}`, async ({ request }) => {
			// Get Body Data using json(), text() or formData() depending on what is sent
			const bodyData = await request.json();

			// Log the request passing the request data, pathName and extra information to the logger function
			logger({
				data: bodyData,
				type: 'POST',
				pathName,
			});

			return HttpResponse.json({
				response: `this is a POST test response from ${pathName} with bodyData ${JSON.stringify(bodyData)}`,
			});
		}),
	];
}

export default handler;
