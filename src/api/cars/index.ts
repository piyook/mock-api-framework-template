import { http, HttpResponse } from "msw";

const handlers = [
  http.get("/cars", ({ request }) => {
    const url = new URL(request.url);
    const carType = url.searchParams.get("type");
    console.log("starting CARS");
    console.log("Car Type is ", carType);
    return HttpResponse.json({ cars: "this is a test response" });
  }),
];

export default handlers;
