import request from "supertest";
import app from "../app/index";
import { createUser } from "./helper";

describe("User Information API Tests", () => {
    let userToken: string;

    beforeAll(async () => {
        userToken = await createUser();
    })

    test("get address of new user", async () => {
        const res = await request(app).get("/api/v1/user/address").set("authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            line_1: null,
            line_2: null,
            landmark: null,
            city: null,
            postal_code: null,
        });

    });

    test("add address of new user", async () => {
        const res = await request(app).post("/api/v1/user/address").set("authorization", `Bearer ${userToken}`).send({
            line_1: "LINE 1 ADDR",
            line_2: "LINE 2 ADDR",
            landmark: "LANDMARK",
            city: "Noida",
            postal_code: 5000034,
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.id).toBeDefined();

        const res2 = await request(app).get("/api/v1/user/address").set("authorization", `Bearer ${userToken}`);

        expect(res2.status).toBe(200);
        expect(res2.body).toMatchObject({
            line_1: expect.any(String),
            line_2: expect.any(String),
            landmark: expect.any(String),
            city: expect.any(String),
            postal_code: expect.any(Number),
        });
    });

    test("shouldn't allow to add address without token", async () => {

        const res = await request(app).post("/api/v1/user/address").send({
            line_1: "LINE 1 ADDR",
            line_2: "LINE 2 ADDR",
            landmark: "LANDMARK",
            city: "Noida",
            postal_code: 5000034,
        });
        expect(res.status).toBe(403);
    })


    test("should add metadata for user", async () => {
        const res = await request(app).patch("/api/v1/user").set("authorization", `Bearer ${userToken}`).send({
            full_name: "Ramesh",
            profile_image: "http://image.com",
            phone_no: 1234567890,
            mail: "test@test.com",
            gender: "Male"
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const res2 = await request(app).get("/api/v1/user").set("authorization", `Bearer ${userToken}`);

        expect(res2.status).toBe(200);
        expect(res2.body).toMatchObject({
            full_name: expect.any(String),
            profile_image: expect.any(String),
            phone_no: expect.any(Number),
            mail: expect.any(String),
            gender: expect.any(String)
        });
    });

    test("should not add metadata for user without token", async () => {
        const res = await request(app).patch("/api/v1/user").send({
            full_name: "Ramesh",
            profile_image: "http://image.com",
            mail: "test@test.com",
            phone_no: 12345648,
            gender: "Male"
        });

        expect(res.status).toBe(403);
    });


});

