import { test, expect, request } from "@playwright/test";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

test("quote → book → accept → start → complete", async ({}) => {
  const api = await request.newContext({ baseURL: API, extraHTTPHeaders: { "x-test-role": "admin" } });

  // health
  const health = await api.get("/health");
  expect(health.ok()).toBeTruthy();

  // quote
  const quoteRes = await api.post("/rides/quote", {
    data: {
      pickup: { lat: 28.6139, lng: 77.2090 },
      dropoff: { lat: 28.4595, lng: 77.0266 },
      rideType: "standard",
    },
  });
  expect(quoteRes.ok()).toBeTruthy();
  const quote = await quoteRes.json();
  expect(quote.estimate).toBeGreaterThan(0);

  // book (as rider)
  const rider = await request.newContext({ baseURL: API, extraHTTPHeaders: { "x-test-role": "rider" } });
  const bookRes = await rider.post("/rides", {
    data: {
      pickup: { lat: 28.6139, lng: 77.2090 },
      dropoff: { lat: 28.4595, lng: 77.0266 },
      rideType: "standard",
    },
  });
  expect(bookRes.ok()).toBeTruthy();
  const ride = await bookRes.json();
  expect(ride.id).toBeTruthy();

  // accept (as driver)
  const driver = await request.newContext({ baseURL: API, extraHTTPHeaders: { "x-test-role": "driver" } });
  const acceptRes = await driver.post(`/rides/${ride.id}/accept`, { data: { driverId: "driver_1" } });
  expect(acceptRes.ok()).toBeTruthy();
  const accepted = await acceptRes.json();
  expect(accepted.status).toBe("accepted");

  // start
  const startRes = await driver.post(`/rides/${ride.id}/start`);
  expect(startRes.ok()).toBeTruthy();
  const started = await startRes.json();
  expect(started.status).toBe("in_progress");

  // complete
  const completeRes = await driver.post(`/rides/${ride.id}/complete`);
  expect(completeRes.ok()).toBeTruthy();
  const completed = await completeRes.json();
  expect(completed.status).toBe("completed");
});


