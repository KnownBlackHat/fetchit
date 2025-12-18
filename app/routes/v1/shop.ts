import client from "../../lib/db";
import { AddInventorySchema, UpdateSeatSchema } from "../../types";
import { Router } from "express";
import { Category, Prisma } from "../../generated/prisma/client";
import { vendorMiddleWare } from "../../middlewares/vendor";
import { userMiddleWare } from "../../middlewares/user";
import { adminMiddleWare } from "../../middlewares/admin";
import { deliveryMiddleWare } from "../../middlewares/deliveryBoy";

export const shopRouter = Router();

shopRouter.get("/", userMiddleWare, async (req, res) => {
    try {
        const shops = await client.shop.findMany();
        const resMap = shops.map((shop) => ({
            id: shop.id,
            username: shop.username,
            shop_name: shop.address,
            rating: shop.rating,
            rating_count: Number(shop.rating_count),
            phone_no: Number(shop.phone_no),
            img_url: shop.img_url,
            active: shop.active,
            category: shop.category,
        }));

        res.json({ shops: resMap })
        return;
    } catch {
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
        return;
    }

})

shopRouter.get("/resturant/seat", vendorMiddleWare, async (req, res) => {
    try {
        const shop = await client.shop.findUnique({
            where: {
                id: req.vendorId
            }
        });

        if (!shop) {
            res.status(404).json({
                success: false,
                error: "Shop not found"
            });
            return;
        }

        if (shop.category !== "Resturant") {
            res.status(400).json({
                success: false,
                error: "Shop is not a restaurant"
            });
            return;
        }

        if (shop.available_seat! <= 0) {
            res.status(400).json({
                success: false,
                error: "No available seats"
            });
            return;
        }

        await client.shop.update({
            where: {
                id: req.vendorId
            },
            data: {
                available_seat: shop.available_seat! - 1
            }
        });

        res.json({
            success: true,
            message: "Seat booked successfully"
        });

        return;

    } catch {
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
        return;
    }
}
)

shopRouter.get("/:category", userMiddleWare, async (req, res) => {
    let categoryParam = req.params.category;
    categoryParam = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase();

    const validCategory = Object.values(Category) as string[];

    if (!validCategory.includes(categoryParam)) {
        res.status(400).json({
            success: false,
            error: "Invalid category"
        })
        return;
    }
    try {
        const shops = await client.shop.findMany({
            where: {
                category: categoryParam as Category
            }

        });
        let resMap;
        if (categoryParam === "Resturant") {
            resMap = shops.map((shop) => ({
                id: shop.id,
                name: shop.shop_name,
                address: shop.address,
                rating: shop.rating,
                rating_count: Number(shop.rating_count),
                phone_no: Number(shop.phone_no),
                img_url: shop.img_url,
                booking: {
                    total_seat: shop.total_seat,
                    available_seat: shop.available_seat
                }
            }));
            res.json({ restaurants: resMap });
        } else {
            resMap = shops.map((shop) => ({
                id: shop.id,
                username: shop.username,
                shop_name: shop.shop_name,
                address: shop.address,
                rating: shop.rating,
                rating_count: Number(shop.rating_count),
                phone_no: Number(shop.phone_no),
                img_url: shop.img_url,
                active: shop.active,
                category: shop.category,
            }));
            res.json({ shops: resMap })
        }

        return;
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
        return;
    }

})

shopRouter.get("/inventory/:shopid", userMiddleWare, async (req, res) => {
    try {
        const inventory = await client.inventory.findMany({
            where: {
                shopId: req.params.shopid
            }
        })
        const inventoryMap = inventory.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            img_url: item.img_url,
            rating: item.rating,
            rate_count: Number(item.rating_count),
            count: item.count
        }))

        res.json({ items: inventoryMap });
        return;

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
        return;
    }

})

shopRouter.post("/inventory", vendorMiddleWare, async (req, res) => {
    const parsedData = AddInventorySchema.safeParse(req.body);
    if (parsedData.success === false) {
        res.status(400).json({
            success: false,
            error: "Invalid request data"
        });
        return;
    }
    try {
        const inven = await client.inventory.create({
            data: {
                name: parsedData.data.name,
                price: parsedData.data.price,
                img_url: parsedData.data.img_url,
                rating: parsedData.data.rating,
                rating_count: parsedData.data.rating_count,
                count: parsedData.data.count,
                shop: {
                    connect: {
                        id: req.vendorId
                    }
                }
            }
        });
        res.json({
            success: true,
            id: inven.id,
        });
        return;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                res.status(409).json({
                    success: false,
                    error: "Item with the same name already exists in the shop"
                });
                return;
            } else {
                res.status(500).json({
                    success: false,
                    error: "Internal Server Error"
                });
                return;
            }
        }
    }
})

shopRouter.patch("/resturant/seat", vendorMiddleWare, async (req, res) => {
    const parsedData = UpdateSeatSchema.safeParse(req.body);
    if (parsedData.success === false) {
        res.status(400).json({
            success: false,
            error: "Invalid request data"
        });
        return;
    }

    try {
        const shop = await client.shop.findUnique({
            where: {
                id: req.vendorId
            }
        });

        if (!shop) {
            res.status(404).json({
                success: false,
                error: "Shop not found"
            });
            return;
        }

        if (shop.category !== "Resturant") {
            res.status(400).json({
                success: false,
                error: "Shop is not a restaurant"
            });
            return;
        }

        if (parsedData.data.available_seat > shop.total_seat!) {
            res.status(400).json({
                success: false,
                error: "Available seats cannot be more than total seats"
            });
            return;
        }

        await client.shop.update({
            where: {
                id: req.vendorId
            },
            data: {
                available_seat: parsedData.data.available_seat
            }
        });

        res.json({
            success: true,
            message: "Available seats updated successfully"
        });
        return;

    }
    catch {
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
        return;
    }
});


shopRouter.delete("/inventory/:itemid", vendorMiddleWare, async (req, res) => {
    try {
        const item = await client.inventory.findUnique({
            where: {
                id: req.params.itemid
            }
        });

        if (!item) {
            res.status(404).json({
                success: false,
                error: "Item not found"
            });
            return;
        }

        if (item.shopId !== req.vendorId) {
            res.status(403).json({
                success: false,
                error: "You are not authorized to delete this item"
            });
            return;
        }

        await client.inventory.delete({
            where: {
                id: req.params.itemid
            }
        });

        res.json({
            success: true,
            message: "Item deleted successfully"
        });
        return;

    } catch {
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
        return;
    }
});

shopRouter.delete("/", vendorMiddleWare, async (req, res) => {
    try {
        await client.shop.delete({
            where: {
                id: req.vendorId
            }
        });

        res.json({
            success: true,
            message: "Shop deleted successfully"
        });
        return;

    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
        return;
    }
});
