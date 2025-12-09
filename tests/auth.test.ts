import request from "supertest";
import app from "../app/index";

describe("Auth API Tests", () => {
    //
    // SIGN UP TESTS
    //
    describe("POST /api/v1/signup", () => {
        test("should sign up a normal user", async () => {
            const res = await request(app)
                .post("/api/v1/signup")
                .send({
                    username: "test_user" + Math.random(),
                    password: "1234",
                    phone_no: 9999999999,
                    role: "user"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        test("should sign up a vendor", async () => {
            const res = await request(app)
                .post("/api/v1/signup")
                .send({
                    username: "vendor1" + Math.random(),
                    role: "vendor",
                    password: "1234",
                    shop_name: "Monet Lounge and Bar",
                    address: "CG 105, Ground Floor",
                    rating: 4.2,
                    rating_count: 2000,
                    phone_no: 1234567890,
                    image_url: "http://image.com/url",
                    active: true
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        test("should sign up a delivery boy", async () => {
            const res = await request(app)
                .post("/api/v1/signup")
                .send({
                    username: "delivery1" + Math.random(),
                    role: "delivery_boy",
                    password: "1234",
                    phone_no: 1234567890,
                    image_url: "http://image.url/com",
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        test("should return 400 on missing fields", async () => {
            const res = await request(app)
                .post("/api/v1/signup")
                .send({
                    username: "wrong"
                    // missing password, role, phone_no
                });

            expect(res.status).toBe(400);
        });
    });

    //
    // SIGN IN TESTS
    //
    describe("POST /api/v1/signin", () => {
        test("should sign in successfully", async () => {
            // first signup
            await request(app).post("/api/v1/signup").send({
                username: "signin_user",
                password: "1234",
                phone_no: 1111111111,
                role: "user"
            });

            const res = await request(app)
                .post("/api/v1/signin")
                .send({
                    username: "signin_user",
                    password: "1234",
                    role: "user"
                });

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        });

        test("should fail on wrong password", async () => {
            const res = await request(app)
                .post("/api/v1/signin")
                .send({
                    username: "signin_user",
                    password: "wrongpass",
                    role: "user"
                });

            expect(res.status).toBe(401);
        });

        test("should return 400 on missing fields", async () => {
            const res = await request(app)
                .post("/api/v1/signin")
                .send({
                    username: "no_role",
                    password: "1234"
                    // role missing
                });

            expect(res.status).toBe(400);
        });
    });
});

