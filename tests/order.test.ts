import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app/index";
import { createUser, createVendor, createDeliveryAgent } from "./helper";

describe("Order Endpoint (POST /api/v1/order)", () => {
    let userToken: string;
    let vendorToken: string;
    let deliveryToken: string;
    let inventoryItems: any[] = [];
    let shopId: string;
    let orderId: string;

    beforeAll(async () => {
        userToken = await createUser();
        vendorToken = await createVendor();
        deliveryToken = await createDeliveryAgent();
        let jwtObj = jwt.decode(vendorToken) as { username: string, role: string, shop_id: string };
        shopId = jwtObj.shop_id;
        let items = [
            {
                name: "Item 1" + Math.random() * 1000,
                img_url: "http://example.com/item1.jpg",
                count: 20,
                price: 10.0,
                retail_price: 8.0,
            },
            {
                name: "Item 2" + Math.random() * 1000,
                img_url: "http://example.com/item1.jpg",
                count: 10,
                price: 20.0,
                retail_price: 10.0,
            },
        ];
        await request(app)
            .post("/api/v1/shop/inventory")
            .set("Authorization", `Bearer ${vendorToken}`)
            .send(items);
        const itemsRes = await request(app).get(`/api/v1/shop/inventory/${shopId}`).set("Authorization", `Bearer ${userToken}`);
        inventoryItems = itemsRes.body.items;
    });


    test("fail to create order with no user address", async () => {

        const res = await request(app).post(`/api/v1/order/${shopId}`).set("Authorization", `Bearer ${userToken}`).send([{
            id: inventoryItems[0].id,
            count: 1
        },
        {
            id: inventoryItems[1].id,
            count: 2
        }
        ]);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("succefully create order", async () => {
        const itemsResPrev = await request(app).get(`/api/v1/shop/inventory/${shopId}`).set("Authorization", `Bearer ${userToken}`);

        await request(app).post("/api/v1/user/address").set("authorization", `Bearer ${userToken}`).send({
            line_1: "LINE 1 ADDR",
            line_2: "LINE 2 ADDR",
            landmark: "LANDMARK",
            city: "Noida",
            postal_code: 5000034,
        });

        const res = await request(app).post(`/api/v1/order/${shopId}`).set("Authorization", `Bearer ${userToken}`).send([{
            id: inventoryItems[0].id,
            count: 1
        },
        {
            id: inventoryItems[1].id,
            count: 2
        }
        ]);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.order_id).toBeDefined();
        orderId = res.body.order_id;


        // Check for the item count in inventory

        const itemsRes = await request(app).get(`/api/v1/shop/inventory/${shopId}`).set("Authorization", `Bearer ${userToken}`);
        expect(itemsRes.body.items[0].count).toBe(itemsResPrev.body.items[0].count - 1);
        expect(itemsRes.body.items[1].count).toBe(itemsResPrev.body.items[1].count - 2);


    });

    test("fail to create order with insufficient inventory", async () => {
        const res = await request(app).post(`/api/v1/order/${shopId}`).set("Authorization", `Bearer ${userToken}`).send([{
            id: inventoryItems[0].id,
            count: 1000
        }]);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("fail to create order with invalid item ID", async () => {
        const res = await request(app).post(`/api/v1/order/${shopId}`).set("Authorization", `Bearer ${userToken}`).send([{
            id: "invalid-id",
            count: 1
        }]);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("fail to create order without authentication", async () => {
        const res = await request(app).post(`/api/v1/order/${shopId}`).send([{
            id: inventoryItems[0].id,
            count: 1
        }]);
        expect(res.status).toBe(403);
    });

    test("fail to create order with empty order list", async () => {
        const res = await request(app).post(`/api/v1/order/${shopId}`).set("Authorization", `Bearer ${userToken}`).send([]);
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("should get active order for user", async () => {
        const res = await request(app).get("/api/v1/order/active").set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(Object.values(res.body).length).toBe(1);
        Object.values(res.body).forEach(item => {
            // @ts-ignore
            expect(item[0]).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                image_url: expect.any(String),
                count: expect.any(Number)
            })
        })
    });

    test("should get active order for vendor", async () => {
        const res = await request(app).get("/api/v1/order/vendor/active").set("Authorization", `Bearer ${vendorToken}`);
        expect(res.status).toBe(200);
        expect(Object.keys(res.body).length).toBe(1);
        Object.values(res.body).forEach(item => {
            // @ts-ignore
            expect(item[0]).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                image_url: expect.any(String),
                count: expect.any(Number)
            });
        });
    });

    test("should get order status to be pending", async () => {
        const res = await request(app).get(`/api/v1/order/status/${orderId}`).set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("PENDING");
        expect(res.body.items).toBeDefined();
        expect(res.body.delivery_agent).toBeDefined();
        // expect(res.body.delivery_agent).toMatchObject({
        //     id: expect.any(String),
        //     name: expect.any(String),
        //     phoneno: expect.any(Number),
        //     img_url: expect.any(String),
        // });
    });

    test("should get intermidate order id on requesting delivery agent", async () => {
        const res = await request(app).get(`/api/v1/order/delivery/get_delivery/${orderId}`).set("Authorization", `Bearer ${deliveryToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBeDefined();
    })

    test("should not get intermidate order id on requesting delivery agent with invalid orderId", async () => {
        const res = await request(app).get('/api/v1/order/delivery/get_delivery/123').set("Authorization", `Bearer ${deliveryToken}`);
        expect(res.status).toBe(404);
    })

    test("delivery agent should get list of order ids with address", async () => {
        const res = await request(app).get('/api/v1/order/delivery/list_orders').set("Authorization", `Bearer ${deliveryToken}`);
        expect(res.status).toBe(200);
        expect(res.body.orders).toBeDefined();
        expect(res.body.orders[0]).toMatchObject({
            orderId: expect.any(String),
            address: expect.any(String)
        });
    });

    test("delivery agent can't get order status before accepting it", async () => {
        const res = await request(app).get(`/api/v1/order/delivery/status/${orderId}`).set("Authorization", `Bearer ${deliveryToken}`);
        expect(res.status).toBe(401);
    })

    test("delivery agent should accept orders", async () => {
        const res = await request(app).get(`/api/v1/order/delivery/accept/${orderId}`).set("Authorization", `Bearer ${deliveryToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });


    test("should get order status to be confirmed", async () => {
        const res = await request(app).get(`/api/v1/order/status/${orderId}`).set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("CONFIRMED");
        expect(res.body.items).toBeDefined();
        expect(res.body.delivery_agent).toBeDefined();
        expect(res.body.delivery_agent).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            phoneno: expect.any(Number),
            image_url: expect.any(String),
        });
    });

    test("delivery agent should get order status after accepting it", async () => {
        const res = await request(app).get(`/api/v1/order/delivery/status/${orderId}`).set("Authorization", `Bearer ${deliveryToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            delivery_address: expect.objectContaining({
                line1: expect.any(String),
                line2: expect.any(String),
                landmark: expect.any(String),
                city: expect.any(String),
                postal_code: expect.any(Number),
            }),
            items: expect.arrayContaining([
                expect.objectContaining(
                    {
                        id: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        count: expect.any(Number),
                        image_url: expect.any(String),
                    })
            ])
        });
    })


    test("should complete order", async () => {
        const res = await request(app).get(`/api/v1/order/complete/${orderId}`).set("Authorization", `Bearer ${deliveryToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const res2 = await request(app).get("/api/v1/order/active").set("Authorization", `Bearer ${userToken}`);
        expect(res2.status).toBe(200);
        expect(Object.values(res2.body).length).toBe(0);
    });

    test("should get order history for user", async () => {
        const res = await request(app).get("/api/v1/order/history").set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(Object.values(res.body).length).toBe(1);
        Object.values(res.body).forEach(item => {
            expect(item).toMatchObject(
                expect.arrayContaining([
                    {
                        id: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        image_url: expect.any(String),
                        count: expect.any(Number)
                    }]))
        })
    });

    test("should get history order for vendor", async () => {
        const res = await request(app).get("/api/v1/order/vendor/history").set("Authorization", `Bearer ${vendorToken}`);
        expect(res.status).toBe(200);
        expect(Object.keys(res.body).length).toBe(1);
        Object.values(res.body).forEach(item => {
            // @ts-ignore
            expect(item[0]).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                image_url: expect.any(String),
                count: expect.any(Number)
            });
        });
    });

    test("should get order status to be delivered", async () => {
        const res = await request(app).get(`/api/v1/order/status/${orderId}`).set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("DELIVERED");
        expect(res.body.items).toBeDefined();
        expect(res.body.delivery_agent).toBeDefined();
        expect(res.body.delivery_agent).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
            phoneno: expect.any(Number),
            image_url: expect.any(String),
        });
    });

});
