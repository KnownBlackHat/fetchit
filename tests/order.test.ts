import { describe, it, expect } from "bun:test";
import request from "supertest";
import app from "../app/index";

describe("Order Endpoint (POST /api/v1/order)", () => {

    // -------- VALID --------
    it("should create order successfully", async () => {
        const res = await request(app)
            .post("/api/v1/order")
            .query({ shopType: "canteen" })
            .send({
                shopid1: ["item1", "item2"],
                shopid2: ["item3"]
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    // -------- MUTUALLY EXCLUSIVE --------
    it("should reject if shopType contains both canteen and den", async () => {
        const res = await request(app)
            .post("/api/v1/order")
            .query({ shopType: "canteen,den" })
            .send({
                shopid1: ["item1"]
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("canteen and den can’t be together");
    });

    // -------- MISSING shopType --------
    it("should reject missing shopType", async () => {
        const res = await request(app)
            .post("/api/v1/order")
            .send({
                shopid1: ["item1"]
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("shopType is required");
    });

    // -------- INVALID shopType --------
    it("should reject unknown shopType", async () => {
        const res = await request(app)
            .post("/api/v1/order")
            .query({ shopType: "randomshop" })
            .send({
                shopid1: ["item1"]
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Invalid shopType");
    });

    // -------- INVALID FIELD TYPE --------
    it("should reject if an item list is not an array", async () => {
        const res = await request(app)
            .post("/api/v1/order")
            .query({ shopType: "canteen" })
            .send({
                shopid1: "not-an-array"
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("items must be an array");
    });

    // -------- EXTRA UNMATCHED FIELDS --------
    it("should reject if unmatched fields provided", async () => {
        const res = await request(app)
            .post("/api/v1/order")
            .query({ shopType: "canteen" })
            .send({
                shopid1: ["item1"],
                unknownField: "something"
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("Unknown field");
    });
});

