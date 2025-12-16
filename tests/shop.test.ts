import request from "supertest";
import jwt from 'jsonwebtoken';
import app from "../app/index";

describe("Shop & Restaurant API Tests", () => {
    let vendorToken1: string;
    let vendorToken2: string;
    let vendorToken3: string;
    let restaurantVendorToken: string;
    let userToken1: string;

    async function createResturantVendor() {
        const username = "test_restaurant" + Math.random();
        const password = "1234";
        const res = await request(app)
            .post("/api/v1/signup")
            .send({
                username,
                role: "vendor",
                password,
                shop_name: "Monet Lounge and Bar",
                address: "CG 105, Ground Floor",
                rating: parseFloat(`${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`),
                rating_count: 2000,
                phone_no: 1234567890,
                img_url: "http://image.com/url",
                category: "Resturant",
                total_seat: 100,
                available_seat: 90,
            });
        return res.body.token;
    }

    async function createVendor() {
        const username = "test_vendor" + Math.random();
        const password = "1234";
        const res = await request(app)
            .post("/api/v1/signup")
            .send({
                username,
                role: "vendor",
                password,
                shop_name: "Monet Lounge and Bar",
                address: "CG 105, Ground Floor",
                rating: parseFloat(`${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`),
                rating_count: 2000,
                phone_no: 1234567890,
                img_url: "http://image.com/url",
                category: "Den"
            });
        return res.body.token;
    }

    async function createUser() {
        const username = "test_user" + Math.random();
        const password = "1234";
        const res = await request(app)
            .post("/api/v1/signup")
            .send({
                username,
                password,
                phone_no: 9999999999,
                full_name: "Ramesh Ranjan",
                img_url: null,
                gender: "Male",
                mail_id: "test@test.com",
                role: "user"
            });

        return res.body.token;
    }


    beforeAll(async () => {
        vendorToken1 = await createVendor();
        vendorToken2 = await createVendor();
        vendorToken3 = await createVendor();
        restaurantVendorToken = await createResturantVendor();
        userToken1 = await createUser();
    });


    test("client should get shops list", async () => {
        const res = await request(app).get("/api/v1/shops");

        expect(res.status).toBe(200);
        expect(res.body.shops).toBe(true);
        expect(res.body.shops.length).toBe(3);
    });

    test("vendor can add items in shop", async () => {
        const res = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product name" + Math.random(),
            "description": "great product",
            "price": Math.floor(Math.random() * 1000),
            "image_url": "https://image.com/url",
            "count": 1000
        });
        const res2 = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product name" + Math.random(),
            "description": "greatest product",
            "price": Math.floor(Math.random() * 1000),
            "image_url": "https://image.com/url",
            "count": 90
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBeDefined();

        expect(res2.status).toBe(200);
        expect(res2.body.success).toBe(true);
        expect(res2.body.id).toBeDefined();
    });

    test("vendor can't add items in shop with missing fields", async () => {
        const res = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product name" + Math.random(),
            "description": "great product",
            "image_url": "https://image.com/url",
            "count": 1000
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("vendor can't add items in shop with same product name", async () => {
        const res = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product1",
            "description": "great product",
            "image_url": "https://image.com/url",
            "price": 29.00,
            "count": 1000
        });
        const res2 = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product1",
            "description": "great product",
            "image_url": "https://image.com/url",
            "price": 290.00,
            "count": 380
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBeDefined();
        expect(res2.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    test("client should get shop items", async () => {
        // @ts-ignore
        const shopId: string = jwt.decode(vendorToken1)?.shop_id

        const res = await request(app).get(`/api/v1/shops/${shopId}/inventory`);

        expect(res.body.items.length).toBe(3);
        expect(res.body.items[0]).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            image_url: expect.any(String),
            rating: expect.any(Number),
            rate_count: expect.any(Number),
            count: expect.any(Number)
        });
    });

    test("client should get restaurant shops list", async () => {
        const res = await request(app).get("/api/v1/restaurant");

        expect(res.status).toBe(200);
        expect(res.body.restaurant).toBe(true);
        expect(res.body.restaurant.length).toBe(1);
        expect(res.body.restaurant[0]).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            address: expect.any(String),
            rating: expect.any(Number),
            rating_count: expect.any(Number),
            phone_no: expect.any(Number),
            img_url: expect.any(String),
            booking: {
                total_seat: expect.any(Number),
                available_seat: expect.any(Number)
            }
        });
    });

    test("restaurant vendor can update available seats", async () => {
        const res = await request(app).patch(`/api/v1/restaurant/seats`).set("authorization", restaurantVendorToken).send({
            available_seat: 80
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const res2 = await request(app).get("/api/v1/restaurant");
        expect(res2.status).toBe(200);
        expect(res2.body.restaurant[0].booking.available_seat).toBe(80);
    });

    test("client can get delivery partner", async () => {
        const res = await request(app).get("/api/v1/delivery_partner");

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            phone_no: expect.any(Number),
            img_url: expect.any(String),
            rating: expect.any(Number),
            order_count: expect.any(Number)
        });
    });

});
