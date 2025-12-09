import request from "supertest";
import app from "../app/index";

describe("Shop & Restaurant API Tests", () => {

    describe("GET /api/v1/shops/:userid", () => {
        test("should return shop list for a user", async () => {
            const res = await request(app).get("/api/v1/shops/user123");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.shops)).toBe(true);

            if (res.body.shops.length) {
                const shop = res.body.shops[0];
                expect(shop).toHaveProperty("id");
                expect(shop).toHaveProperty("name");
                expect(shop).toHaveProperty("address");
                expect(shop).toHaveProperty("rating");
            }
        });
    });


    describe("GET /api/v1/shops/:shopid/inventory", () => {
        test("should return inventory list", async () => {
            const res = await request(app).get("/api/v1/shops/shop123/inventory");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.items)).toBe(true);

            if (res.body.items.length) {
                const item = res.body.items[0];
                expect(item).toHaveProperty("name");
                expect(item).toHaveProperty("price");
                expect(item).toHaveProperty("image_url");
            }
        });
    });


    describe("POST /api/v1/shop/:shopid/inventory", () => {

        test("should add inventory item", async () => {
            const res = await request(app)
                .post("/api/v1/shop/shop123/inventory")
                .send({
                    name: "Item 1",
                    description: "great product",
                    price: 399.0,
                    image_url: "https://image.com",
                    rating: null,
                    rate_count: null,
                    active: true
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.id).toBeDefined();
        });

        test("should return 400 for invalid body", async () => {
            const res = await request(app)
                .post("/api/v1/shop/shop123/inventory")
                .send({
                    name: "Missing required fields"
                });

            expect(res.status).toBe(400);
        });

        test("should return 409 if item already exists", async () => {
            const body = {
                name: "Duplicate Product",
                description: "x",
                price: 199,
                image_url: "https://",
                rating: 3.0,
                rate_count: 100,
                active: true
            };

            // first attempt
            await request(app).post("/api/v1/shop/shop123/inventory").send(body);

            // second attempt → conflict
            const res = await request(app)
                .post("/api/v1/shop/shop123/inventory")
                .send(body);

            expect(res.status).toBe(409);
        });
    });


    describe("GET /api/v1/delivery_partners", () => {
        test("should return list of delivery partners", async () => {
            const res = await request(app).get("/api/v1/delivery_partners");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.partners)).toBe(true);

            if (res.body.partners.length) {
                const partner = res.body.partners[0];
                expect(partner).toHaveProperty("id");
                expect(partner).toHaveProperty("name");
                expect(partner).toHaveProperty("available");
            }
        });
    });


    describe("GET /api/v1/restaurant", () => {
        test("should return restaurant list", async () => {
            const res = await request(app).get("/api/v1/restaurant");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.restaurants)).toBe(true);

            if (res.body.restaurants.length) {
                const rest = res.body.restaurants[0];
                expect(rest).toHaveProperty("name");
                expect(rest.booking).toHaveProperty("total_seat");
            }
        });
    });


    describe("POST /api/v1/restaurant", () => {

        test("should add a restaurant", async () => {
            const res = await request(app)
                .post("/api/v1/restaurant")
                .send({
                    name: "New Restaurant",
                    address: "Somewhere",
                    rating: null,
                    rating_count: null,
                    phone_no: 1234567890,
                    image_url: "http://img.com",
                    total_seat: 100
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.id).toBeDefined();
        });

        test("should return 400 for invalid body", async () => {
            const res = await request(app)
                .post("/api/v1/restaurant")
                .send({
                    name: "Only Name"
                });

            expect(res.status).toBe(400);
        });

        test("should return 409 when restaurant already exists", async () => {
            const body = {
                name: "Duplicate Restaurant",
                address: "Place",
                rating: 4.2,
                rating_count: 200,
                phone_no: 1234567890,
                image_url: "http://img.com",
                total_seat: 50
            };

            // first time OK
            await request(app).post("/api/v1/restaurant").send(body);

            // second time → conflict
            const res = await request(app)
                .post("/api/v1/restaurant")
                .send(body);

            expect(res.status).toBe(409);
        });
    });


    describe("PATCH /api/v1/restaurant/:id/seat", () => {

        test("should update restaurant seat info", async () => {
            const res = await request(app)
                .patch("/api/v1/restaurant/rest123/seat")
                .send({
                    total_seat: 100,
                    available_seat: 50
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 400 for invalid seat info", async () => {
            const res = await request(app)
                .patch("/api/v1/restaurant/rest123/seat")
                .send({
                    available_seat: "not number"
                });

            expect(res.status).toBe(400);
        });
    });

});

