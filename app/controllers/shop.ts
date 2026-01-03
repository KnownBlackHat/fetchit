import { AddInventorySchema } from "@/types";
import type { Request, Response } from "express";
import client from "@/lib/db";
import { ParseError } from "@/utils/errorClasses";

export async function addInventoryHandler(req: Request, res: Response) {
    const parsedData = AddInventorySchema.safeParse(req.body);
    if (parsedData.success === false) {
        throw new ParseError();
    }
    const dataMap = parsedData.data.map(item => ({
        name: item.name,
        price: item.price,
        img_url: item.img_url,
        rating: item.rating,
        rating_count: item.rating_count,
        count: item.count,
        shopId: req.vendorId,
        retail_price: item.retail_price,

    }))
    await client.inventory.createMany({
        data: dataMap,
    });
    res.json({
        success: true,
    });
    return;
}
