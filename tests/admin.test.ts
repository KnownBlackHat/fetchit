import { describe, it, expect } from "bun:test";
import request from "supertest";
import app from "../app/index";

describe("Admin Endpoints", () => {

    // ============================
    // 1. GET /shops/:shopid/admin
    // ============================
    it("should return vendor shop info for admin", async () => {
        const res = await request(app)
            .get("/api/v1/shops/abcid1/admin")
            .set("Authorization", "Bearer faketoken");

        expect(res.status).toBe(200);
        expect(res.body.shop).toBeDefined();
        expect(res.body.shop.id).toBe("abcid1");
    });

    it("should return 404 for non-existing shop", async () => {
        const res = await request(app)
            .get("/api/v1/shops/invalidshop/admin")
            .set("Authorization", "Bearer faketoken");

        expect(res.status).toBe(404);
        expect(res.body.error).toContain("Shop not found");
    });

    // ============================
    // 2. PATCH /shops/:shopid/admin
    // ============================
    it("should update vendor shop info", async () => {
        const res = await request(app)
            .patch("/api/v1/shops/abcid1/admin")
            .set("Authorization", "Bearer faketoken")
            .send({
                active: false
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should reject unknown fields in PATCH", async () => {
        const res = await request(app)
            .patch("/api/v1/shops/abcid1/admin")
            .set("Authorization", "Bearer faketoken")
            .send({
                active: false,
                randomField: "something"
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Unknown field");
    });

    it("should return 400 if 'active' is not boolean", async () => {
        const res = await request(app)
            .patch("/api/v1/shops/abcid1/admin")
            .set("Authorization", "Bearer faketoken")
            .send({
                active: "yes"
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("active must be boolean");
    });

    // ============================
    // 3. GET /shops/admin — superuser list
    // ============================
    it("should return all shops for super user", async () => {
        const res = await request(app)
            .get("/api/v1/shops/admin")
            .set("Authorization", "Bearer faketoken");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.shops)).toBe(true);
        expect(res.body.shops.length).toBeGreaterThan(0);
    });

    // ============================
    // 4. PATCH /shops/:shopid/admin (super user)
    // same endpoint, different role
    // ============================
    it("should update shop info for super user", async () => {
        const res = await request(app)
            .patch("/api/v1/shops/abcid2/admin")
            .set("Authorization", "Bearer faketoken")
            .send({
                active: true
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // ============================
    // EXTRA NEGATIVE TESTS
    // ============================

    it("should reject if body is empty on PATCH", async () => {
        const res = await request(app)
            .patch("/api/v1/shops/abcid1/admin")
            .set("Authorization", "Bearer faketoken")
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("No valid fields provided");
    });

    it("should return 401 if no auth token", async () => {
        const res = await request(app)
            .get("/api/v1/shops/admin");

        expect(res.status).toBe(401);
        expect(res.body.error).toContain("Unauthorized");
    });
});

