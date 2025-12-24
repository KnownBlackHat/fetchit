import request from "supertest";
import jwt from 'jsonwebtoken';
import app from "../app/index";
import { createResturantVendor, createVendor, createUser } from "./helper";

describe("Shop & Restaurant API Tests", () => {
    let vendorToken1: string;
    let vendorToken2: string;
    let vendorToken3: string;
    let restaurantVendorToken: string;
    let userToken1: string;



    beforeAll(async () => {
        vendorToken1 = `Bearer ${await createVendor()}`;
        vendorToken2 = `Bearer ${await createVendor()}`;
        vendorToken3 = `Bearer ${await createVendor()}`;
        restaurantVendorToken = `Bearer ${await createResturantVendor()}`;
        userToken1 = `Bearer ${await createUser()}`;
    });

    afterAll(async () => {
        await request(app).delete("/api/v1/shop").set("authorization", vendorToken1);
        await request(app).delete("/api/v1/shop").set("authorization", vendorToken2);
        await request(app).delete("/api/v1/shop").set("authorization", vendorToken3);
        await request(app).delete("/api/v1/shop").set("authorization", restaurantVendorToken);
    });


    test("client should get shops list", async () => {
        const res = await request(app).get("/api/v1/shop").set("authorization", userToken1);

        expect(res.status).toBe(200);
        expect(res.body.shops).toBeDefined();
        expect(res.body.shops.length).toBe(4);
    });

    test("vendor can add items in shop", async () => {
        const res = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product name" + Math.random(),
            "price": Math.floor(Math.random() * 1000),
            "img_url": "https://image.com/url",
            "count": 1000
        });
        const res2 = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product name" + Math.random(),
            "description": "greatest product",
            "price": Math.floor(Math.random() * 1000),
            "img_url": "https://image.com/url",
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
            "name": "product2",
            "img_url": "https://image.com/url",
            "price": 29.00,
            "count": 1000
        });
        const res2 = await request(app).post(`/api/v1/shop/inventory`).set("authorization", vendorToken1).send({
            "name": "product2",
            "img_url": "https://image.com/url",
            "price": 290.00,
            "count": 380
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBeDefined();
        expect(res2.status).toBe(409);
        expect(res2.body.success).toBe(false);
    });

    test("client should get shop items", async () => {
        // @ts-ignore
        const shopId: string = jwt.decode(vendorToken1.split(' ')[1])?.shop_id

        const res = await request(app).get(`/api/v1/shop/inventory/${shopId}`).set("authorization", userToken1);

        expect(res.status).toBe(200);
        expect(res.body.items).toBeDefined();
        expect(res.body.items.length).toBe(3);
        expect(res.body.items[0]).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            img_url: expect.any(String),
            rating: expect.any(Number),
            rate_count: expect.any(Number),
            count: expect.any(Number)
        });
    });

    test("client should get restaurant shops list", async () => {
        const res = await request(app).get("/api/v1/shop/resturant").set("authorization", userToken1);

        expect(res.status).toBe(200);
        expect(res.body.restaurants).toBeDefined();
        expect(res.body.restaurants.length).toBe(1);
        expect(res.body.restaurants[0]).toMatchObject({
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

    test("client shouldn't get restaurant shops list without token", async () => {
        const res = await request(app).get("/api/v1/shop/resturant");

        expect(res.status).toBe(403);
    });

    test("client shouldn't get restaurant shops list with wrong token", async () => {
        const res = await request(app).get("/api/v1/shop/resturant").set("authorization", "Bearer asdadjsa.asdsads.asdsa");;

        expect(res.status).toBe(401);
    });

    test("restaurant vendor can update available seats", async () => {
        const res = await request(app).patch(`/api/v1/shop/resturant/seat`).set("authorization", restaurantVendorToken).send({
            available_seat: 80
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const res2 = await request(app).get("/api/v1/shop/resturant").set("authorization", userToken1);
        expect(res2.status).toBe(200);
        expect(res2.body.restaurants[0].booking.available_seat).toBe(80);
    });

    // test("client can get delivery partner", async () => {
    //     const res = await request(app).get("/api/v1/delivery_partner").set("authorization", userToken1);

    //     expect(res.status).toBe(200);
    //     expect(res.body).toMatchObject({
    //         id: expect.any(String),
    //         name: expect.any(String),
    //         phone_no: expect.any(Number),
    //         img_url: expect.any(String),
    //         rating: expect.any(Number),
    //         order_count: expect.any(Number)
    //     });
    // });

});
