import client from "../../lib/db";
import { AddInventorySchema } from "../../types";
import { Router } from "express";
import { Prisma } from "../../generated/prisma/client";
import { vendorMiddleWare } from "../../middlewares/vendor";
import { userMiddleWare } from "../../middlewares/user";
import { adminMiddleWare } from "../../middlewares/admin";
import { deliveryMiddleWare } from "../../middlewares/deliveryBoy";


export const restaurantRouter = Router();

restaurantRouter.get("/", async () => {
    try {
        const restaurants = await client.shop.findMany({
            where: {
                category: "Resturant"
            }
        })
    } catch { }
})
