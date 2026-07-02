const API_URL = process.env.API_URL || "http://localhost:5000";

const test = async (name, request, expectedStatus) => {
  try {
    const response = await request();
    const passed = response.status === expectedStatus;
    const label = passed ? "PASS" : "FAIL";

    console.log(`${label}: ${name} (${response.status})`);
    return response;
  } catch (error) {
    console.log(`FAIL: ${name} (${error.message})`);
    return null;
  }
};

const login = async (username, password) => {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  return data.token;
};

const accommodationData = {
  title: "Endpoint Test Home",
  location: "Cape Town",
  description: "This listing is created by the endpoint verification script.",
  bedrooms: 1,
  bathrooms: 1,
  guests: 2,
  type: "Entire apartment",
  price: 100,
  amenities: ["wifi"],
  images: [],
  weeklyDiscount: 0,
  cleaningFee: 20,
  serviceFee: 10,
  occupancyTaxes: 5,
};

const run = async () => {
  console.log(`Checking endpoints at ${API_URL}`);

  const userToken = await login("John Doe", "password123");
  const hostToken = await login("Jane Doe", "password321");

  if (!userToken || !hostToken) {
    console.log("Could not login demo users. Make sure the backend is running and MongoDB is connected.");
    return;
  }

  await test(
    "normal user cannot create accommodation",
    () =>
      fetch(`${API_URL}/api/accommodations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(accommodationData),
      }),
    403
  );

  await test(
    "host gets validation error for bad accommodation",
    () =>
      fetch(`${API_URL}/api/accommodations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hostToken}`,
        },
        body: JSON.stringify({ ...accommodationData, price: 0 }),
      }),
    400
  );

  const createResponse = await test(
    "host can create accommodation",
    () =>
      fetch(`${API_URL}/api/accommodations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hostToken}`,
        },
        body: JSON.stringify(accommodationData),
      }),
    201
  );

  const accommodation = createResponse ? await createResponse.json() : null;

  if (!accommodation || !accommodation._id) {
    console.log("Stopping because accommodation was not created.");
    return;
  }

  const reservationResponse = await test(
    "normal user can create reservation",
    () =>
      fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          bookedBy: "John Doe",
          property: accommodation.title,
          accommodation: accommodation._id,
          checkin: "2026-07-01",
          checkout: "2026-07-07",
          guests: 1,
          totalPrice: 700,
        }),
      }),
    201
  );

  const reservation = reservationResponse ? await reservationResponse.json() : null;

  await test(
    "host can view host reservations",
    () =>
      fetch(`${API_URL}/api/reservations/host`, {
        headers: { Authorization: `Bearer ${hostToken}` },
      }),
    200
  );

  await test(
    "normal user cannot delete host accommodation",
    () =>
      fetch(`${API_URL}/api/accommodations/${accommodation._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      }),
    403
  );

  if (reservation && reservation._id) {
    await test(
      "host can delete reservation for own listing",
      () =>
        fetch(`${API_URL}/api/reservations/${reservation._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${hostToken}` },
        }),
      200
    );
  }

  await test(
    "host can delete own accommodation",
    () =>
      fetch(`${API_URL}/api/accommodations/${accommodation._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${hostToken}` },
      }),
    200
  );
};

run();
