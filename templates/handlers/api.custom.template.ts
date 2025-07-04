// Custom handler with middleware
// Copy and save as api.ts in the api path folder in your project

import { http, HttpResponse } from 'msw';
// import { db } from '../src/models/db.js'; // Uncomment this line if you have a db model to use
//import logger from '../../utilities/logger'; // Import your logger utility if needed
function handler(pathName: string) {
	return [
		// Add any http handler here (get, push , delete etc., and middleware as needed)
		http.get(`/${pathName}`, ({ request }) => {
			console.log('GET request received:', request.url);
			// GET action code here
			// const url = new URL(request.url);

			// get url parameters using url.searchParams.get('paramName')
			// const type = url.searchParams.get('type');

			// Get data from db using db.[modelName].getAll()
			// E.g const cats = db.cat.getAll();
			// E.g return HttpResponse.json(cats);

			// if needed, Log the request passing the request data, pathName and request type to the logger function - can be logged in all http methods
			// logger({
			// 	data: { type },
			// 	pathName,
			// 	type: 'GET',
			// });

			// Middleware code here if needed and can return json, text or other responses
			return HttpResponse.json({
				response: `this is a GET test response from ${pathName}`,
			});
		}),
		// Repeat process for POST, PUT and DELETE
		http.post(`/${pathName}`, ({ request }) => {
			// POST action code here using db.[modelName].create({data})
			console.log('POST request received:', request.body);
			return HttpResponse.json({
				response: `this is a POST test response from ${pathName}`,
			});
		}),
		http.put(`/${pathName}`, ({ request }) => {
			console.log('PUT request received:', request.body);
			// PUT action code here using db.[modelName].update({data})
			return HttpResponse.json({
				response: `this is a PUT test response from ${pathName}`,
			});
		}),
		http.delete(`/${pathName}`, ({ request }) => {
			console.log('DELETE request received:', request.body);
			// DELETE action code here using db.[modelName].delete({data})
			return HttpResponse.json({
				response: `this is a DELETE test response from ${pathName}`,
			});
		}),
	];
}

export default handler;
