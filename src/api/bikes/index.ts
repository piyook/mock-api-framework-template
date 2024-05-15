import { http, HttpResponse } from "msw";

const handlers = [
  http.get("/bikes", ({ request }) => {
    const url = new URL(request.url);
    const bikeType = url.searchParams.get("type");
    console.log("starting BIKES");
    console.log("Bike Type is ", bikeType);
    return HttpResponse.json({ bikes: "this is a test response" });
  }),
  http.get("/bikes2", ({ request }) => {
    const url = new URL(request.url);
    const bikeType = url.searchParams.get("type");
    console.log("starting BIKES2");
    console.log("Bike2 Type is ", bikeType);
    return HttpResponse.json({ bikes: "this is a test response" });
  }),
];

export default handlers;
