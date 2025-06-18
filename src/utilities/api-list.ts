import { http, HttpResponse } from 'msw';
import { prefix } from './env';
const apiList = (apiList: string[] = ['1', '2', '3']) => [
	http.get(`/api`, () => {
		const apiPaths = apiList.map((path) => `/${prefix}${path}`);
		return HttpResponse.json(apiPaths);
	}),
];

export { apiList };
