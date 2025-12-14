import { Router } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import client from "../../lib/db";
import { SignInSchema, SignUpSchema } from "../../types";

export const router = Router();

router.post("/signup", async (req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            success: false,
            error: "Invalid request data"
        });
        return;
    }

    try {
        let payload: JwtPayload;
        switch (parsedData.data.role) {
            case "user":
                const userDbResponse = await client.user.create({
                    data: {
                        username: parsedData.data.username,
                        fullname: parsedData.data.full_name,
                        img_url: parsedData.data.img_url,
                        password: parsedData.data.password,
                        phone_no: parsedData.data.phone_no,
                        mail_id: parsedData.data.mail_id,
                        gender: parsedData.data.gender
                    }
                });
                payload = {
                    usrid: userDbResponse.id,
                    username: userDbResponse.username,
                    role: "user"
                }
                break;
            case "admin":
                let adminDbResponse = await client.admin.create({
                    data: {
                        username: parsedData.data.username,
                        password: parsedData.data.password,
                        phone_no: parsedData.data.phone_no,
                    }
                })
                payload = {
                    usrid: adminDbResponse.id,
                    username: adminDbResponse.username,
                    role: "admin"
                }
                break;
            case "delivery_boy":
                let deliveryDbResponse = await client.delivery.create({
                    data: {
                        username: parsedData.data.username,
                        password: parsedData.data.password,
                        phone_no: parsedData.data.phone_no,
                        img_url: parsedData.data.img_url,
                    }
                })
                payload = {
                    usrid: deliveryDbResponse.id,
                    username: deliveryDbResponse.username,
                    role: "delivery_boy"
                }
                break;
            case "vendor":
                let vendorDbResponse = await client.shop.create({
                    data: {
                        username: parsedData.data.username,
                        password: parsedData.data.password,
                        shop_name: parsedData.data.shop_name,
                        address: parsedData.data.address,
                        rating: parsedData.data.rating,
                        rating_count: parsedData.data.rating_count,
                        phone_no: parsedData.data.phone_no,
                        img_url: parsedData.data.img_url,
                        active: parsedData.data.active,
                        category: parsedData.data.category,
                        total_seat: parsedData.data.total_seat,
                        available_seat: parsedData.data.available_seat,
                        total_revenue: parsedData.data.total_revenue,
                        commission: parsedData.data.commission,
                        avg_order_value: parsedData.data.avg_order_value,
                    }
                })
                payload = {
                    username: vendorDbResponse.username,
                    shop_id: vendorDbResponse.id,
                    role: "vendor"
                }
                break;
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET || "MY_SECRET")
        res.json({
            success: true,
            token
        })
    } catch (e) {
        res.status(400).json({
            success: false,
            error: "User already exsists -> " + e
        })
    }
})

router.post("/signin", async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            success: false,
            error: "Invalid request data"
        });
        return;
    }

    try {
        let user;
        switch (parsedData.data.role) {
            case "user":
                user = await client.user.findUnique({
                    where: {
                        username: parsedData.data.username
                    }
                });
                break;
            case "admin":
                user = await client.admin.findUnique({
                    where: {
                        username: parsedData.data.username
                    }
                });
                break;
            case "vendor":
                user = await client.shop.findUnique({
                    where: {
                        username: parsedData.data.username
                    }
                });
                break;
            case "delivery_boy":
                user = await client.delivery.findUnique({
                    where: {
                        username: parsedData.data.username
                    }
                });
                break;
        }

        if (!user) {
            res.status(401).json({
                success: false,
                error: "User not found"
            });
            return;
        }
        if (user.password !== parsedData.data.password) {
            res.status(401).json({
                success: false,
                error: "Invalid credentials"
            });
            return;
        }

        let payload: JwtPayload;
        if (parsedData.data.role === "vendor") {
            payload = {
                username: user.username,
                shop_id: user.id,
                role: "vendor"
            }
        } else {
            payload = {
                usrid: user.id,
                username: user.username,
                role: parsedData.data.role
            }
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET || "MY_SECRET")
        res.json({
            success: true,
            token
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Internal Server Error" + e
        })
    }
})
