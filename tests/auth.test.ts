import request from "supertest";
import app from "../app/index";

describe("Auth API Tests", () => {
    test("should sign up a normal user", async () => {
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
                role: "user"
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();

        const signinres = await request(app).post("/api/v1/signin").send({
            username, password, role: "user"
        });

        expect(signinres.status).toBe(200);
        expect(signinres.body.success).toBe(true);
        expect(signinres.body.token).toBeDefined();
        expect(signinres.body.token).toBe(res.body.token);

        expect(signinres.body.token).toMatchObject({
            username: username,
            role: "user"
        });
        expect(signinres.body.token.usrid).toBeDefined();

    });

    test("should sign up a admin", async () => {
        const username = "test_admin" + Math.random();
        const password = "1234";

        const res = await request(app)
            .post("/api/v1/signup")
            .send({
                username,
                password,
                phone_no: 9999999999,
                full_name: "Suresh Kumar",
                img_url: null,
                role: "admin"
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();

        const signinres = await request(app).post("/api/v1/signin").send({
            username, password, role: "user"
        });

        expect(signinres.status).toBe(200);
        expect(signinres.body.success).toBe(true);
        expect(signinres.body.token).toBeDefined();
        expect(signinres.body.token).toBe(res.body.token);

        expect(signinres.body.token).toMatchObject({
            username: username,
            role: "admin"
        });
        expect(signinres.body.token.usrid).toBeDefined();

    });

    test("should sign up a vendor", async () => {
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
                rating: 4.2,
                rating_count: 2000,
                phone_no: 1234567890,
                image_url: "http://image.com/url",
                category: "den"
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();

        const signinres = await request(app).post("/api/v1/signin").send({
            username, password, role: "vendor"
        });
        expect(signinres.status).toBe(200);
        expect(signinres.body.success).toBe(true);
        expect(signinres.body.token).toBeDefined();
        expect(signinres.body.token).toBe(res.body.token);

        expect(signinres.body.token).toMatchObject({
            username: username,
            role: "vendor"
        });
        expect(signinres.body.token.usrid).toBeDefined();
        expect(signinres.body.token.shop_id).toBeDefined();

    });

    test("should sign up a delivery boy", async () => {
        const username = "test_delivery" + Math.random();
        const password = "1234";

        const res = await request(app)
            .post("/api/v1/signup")
            .send({
                username,
                password,
                role: "delivery_boy",
                phone_no: 1234567890,
                image_url: "http://image.url/com",
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();

        const signinres = await request(app).post("/api/v1/signin").send({
            username, password, role: "delivery_boy"
        });
        expect(signinres.status).toBe(200);
        expect(signinres.body.success).toBe(true);
        expect(signinres.body.token).toBeDefined();
        expect(signinres.body.token).toBe(res.body.token);

        expect(signinres.body.token).toMatchObject({
            username: username,
            role: "delivery_boy"
        });
        expect(signinres.body.token.usrid).toBeDefined();


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

    test("should return 400 on invalid role", async () => {
        const res = await request(app)
            .post("/api/v1/signup")
            .send({
                username: "wrong_role",
                password: "1234",
                phone_no: 9999999999,
                full_name: "Invalid Role User",
                img_url: null,
                role: "superuser" // invalid role
            });

        expect(res.status).toBe(400);
    });

    test("should return 400 on wrong password", async () => {
        const username = "test_user_wrong_pass" + Math.random();
        const password = "1234";

        await request(app)
            .post("/api/v1/signup")
            .send({
                username,
                password,
                phone_no: 9999999999,
                full_name: "Ramesh Ranjan",
                img_url: null,
                role: "user"
            });

        const signinres = await request(app).post("/api/v1/signin").send({
            username, password: "wrongpassword", role: "user"
        });

        expect(signinres.status).toBe(400);
    });

    test("should return 400 on non-existent user", async () => {
        const signinres = await request(app).post("/api/v1/signin").send({
            username: "non_existent_user_" + Math.random(),
            password: "1234",
            role: "user"
        });

        expect(signinres.status).toBe(400);
    });

    test("should return 403 on role mismatch", async () => {
        const username = "test_user_role_mismatch" + Math.random();
        const password = "1234";

        await request(app)
            .post("/api/v1/signup")
            .send({
                username,
                password,
                phone_no: 9999999999,
                full_name: "Ramesh Ranjan",
                img_url: null,
                role: "user"
            });

        const signinres = await request(app).post("/api/v1/signin").send({
            username, password, role: "admin" // role mismatch
        });

        expect(signinres.status).toBe(403);
    });

});
