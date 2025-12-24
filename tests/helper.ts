import request from "supertest";
import app from "../app/index";

export async function createResturantVendor() {
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

export async function createVendor() {
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

export async function createUser() {
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
