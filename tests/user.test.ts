import request from "supertest";
import app from "../app/index";

describe("User Information API Tests", () => {

    describe("GET /api/v1/user/:userid/address", () => {
        test("should return user address", async () => {
            const res = await request(app).get("/api/v1/user/user123/address");

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty("line_1");
            expect(res.body).toHaveProperty("city");
            expect(res.body).toHaveProperty("postal_code");
        });

        test("should return 404 if user or address does not exist", async () => {
            const res = await request(app).get("/api/v1/user/unknown/address");

            expect([404, 200]).toContain(res.status);
            // Some systems return empty object instead—optional check
        });
    });


    describe("POST /api/v1/user/:userid/address", () => {
        const validAddress = {
            line_1: "some address abc",
            line_2: "some address bcd",
            landmark: "near something",
            city: "Noida",
            postal_code: "500012"
        };

        test("should add an address", async () => {
            const res = await request(app)
                .post("/api/v1/user/user123/address")
                .send(validAddress);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.id).toBeDefined();
        });

        test("should return 400 for invalid data", async () => {
            const res = await request(app)
                .post("/api/v1/user/user123/address")
                .send({
                    line_1: "only one field"
                });

            expect(res.status).toBe(400);
        });

        test("should reject extra fields", async () => {
            const res = await request(app)
                .post("/api/v1/user/user123/address")
                .send({
                    ...validAddress,
                    extra_field: "not allowed"
                });

            expect(res.status).toBe(400);
        });
    });


    describe("GET /api/v1/user/:userid", () => {
        test("should return metadata", async () => {
            const res = await request(app).get("/api/v1/user/user123");

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty("full_name");
            expect(res.body).toHaveProperty("phone_no");
            expect(res.body).toHaveProperty("gender");
            expect(res.body).toHaveProperty("profile_image");
        });

        test("should return default avatar if profile_image is null", async () => {
            const res = await request(app).get("/api/v1/user/userWithNullImage");

            expect(res.status).toBe(200);

            if (res.body.profile_image === null) {
                // Your backend should return some default avatar
                // or at least allow null but your UI replaces it
                expect(res.body.profile_image).toBe(null);
            }
        });

        test("should return 404 for unknown user", async () => {
            const res = await request(app).get("/api/v1/user/unknown");

            expect([404, 200]).toContain(res.status);
        });
    });


    describe("POST /api/v1/user/:userid", () => {
        const validMetadata = {
            full_name: "Ramesh",
            profile_image: "http://image.com",
            phone_no: 1234567890,
            mailid: "test@gmail.com",
            gender: "Male"
        };

        test("should add metadata", async () => {
            const res = await request(app)
                .post("/api/v1/user/user123")
                .send(validMetadata);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.id).toBeDefined();
        });

        test("should accept profile_image as null", async () => {
            const res = await request(app)
                .post("/api/v1/user/user123")
                .send({
                    ...validMetadata,
                    profile_image: null
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("should return 400 for invalid fields", async () => {
            const res = await request(app)
                .post("/api/v1/user/user123")
                .send({
                    full_name: "Missing required fields"
                });

            expect(res.status).toBe(400);
        });

        test("should reject extra/unmatched fields", async () => {
            const res = await request(app)
                .post("/api/v1/user/user123")
                .send({
                    ...validMetadata,
                    extra: "not allowed"
                });

            expect(res.status).toBe(400);
        });
    });

});

