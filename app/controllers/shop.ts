import { AddInventorySchema, UpdateSeatSchema } from "@/types";
import type { Request, Response } from "express";
import client from "@/lib/db";
import { CustomError, ParseError } from "@/utils/errorClasses";
import { Category } from "@/generated/prisma/enums";

export async function addInventoryHandler(req: Request, res: Response) {
  const parsedData = AddInventorySchema.safeParse(req.body);
  if (parsedData.success === false) {
    throw new ParseError();
  }
  const dataMap = parsedData.data.map((item) => ({
    name: item.name,
    price: item.price,
    img_url: item.img_url,
    rating: item.rating,
    rating_count: item.rating_count,
    count: item.count,
    shopId: req.vendorId,
    retail_price: item.retail_price,
  }));
  await client.inventory.createMany({
    data: dataMap,
  });
  res.json({
    success: true,
  });
  return;
}

export async function getShopsList(req: Request, res: Response) {
  const shops = await client.shop.findMany();
  const resMap = shops.map((shop) => ({
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

  res.json({ shops: resMap });
}

export async function getRestaurantSeat(req: Request, res: Response) {
  const shop = await client.shop.findUnique({
    where: {
      id: req.vendorId,
    },
  });

  if (!shop) {
    throw new CustomError("Shop not found", 404);
  }

  if (shop.category !== "Resturant") {
    throw new CustomError("This entity is not resturant", 400);
  }

  if (shop.available_seat! <= 0) {
    throw new CustomError("No available seats", 400);
  }

  await client.shop.update({
    where: {
      id: req.vendorId,
    },
    data: {
      available_seat: shop.available_seat! - 1,
    },
  });

  res.json({
    success: true,
    message: "Seat booked successfully",
  });
}

export async function getShopByCategory(req: Request, res: Response) {
  let categoryParam = req.params.category;
  categoryParam =
    categoryParam.charAt(0).toUpperCase() +
    categoryParam.slice(1).toLowerCase();

  const validCategory = Object.values(Category) as string[];

  if (!validCategory.includes(categoryParam)) {
    throw new ParseError();
  }
  const shops = await client.shop.findMany({
    where: {
      category: categoryParam as Category,
    },
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
        available_seat: shop.available_seat,
      },
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
    res.json({ shops: resMap });
  }
}

export async function getInventoryItemsByShopId(req: Request, res: Response) {
  const inventory = await client.inventory.findMany({
    where: {
      shopId: req.params.shopid,
    },
  });
  const inventoryMap = inventory.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    img_url: item.img_url,
    retail_price: item.retail_price,
    rating: item.rating,
    rate_count: Number(item.rating_count),
    count: item.count,
  }));

  res.json({ items: inventoryMap });
}

export async function patchRestaurantSeat(req: Request, res: Response) {
  const parsedData = UpdateSeatSchema.safeParse(req.body);
  if (parsedData.success === false) {
    throw new ParseError();
  }

  const shop = await client.shop.findUnique({
    where: {
      id: req.vendorId,
    },
  });

  if (!shop) {
    throw new CustomError("Shop not found", 404);
  }

  if (shop.category !== "Resturant") {
    throw new CustomError("This entity is not restaurant");
  }

  if (parsedData.data.available_seat > shop.total_seat!) {
    throw new CustomError("Available seats cannot be more than total seats");
  }

  await client.shop.update({
    where: {
      id: req.vendorId,
    },
    data: {
      available_seat: parsedData.data.available_seat,
    },
  });

  res.json({
    success: true,
    message: "Available seats updated successfully",
  });
  return;
}

export async function deleteItems(req: Request, res: Response) {
  const item = await client.inventory.findUnique({
    where: {
      id: req.params.itemid,
    },
  });

  if (!item) {
    throw new CustomError("Item not found", 404);
  }

  if (item.shopId !== req.vendorId) {
    throw new CustomError("You are not authorized to delete this item", 403);
  }

  await client.inventory.delete({
    where: {
      id: req.params.itemid,
    },
  });

  res.json({
    success: true,
    message: "Item deleted successfully",
  });
  return;
}

export async function deleteShop(req: Request, res: Response) {
  await client.shop.delete({
    where: {
      id: req.vendorId,
    },
  });

  res.json({
    success: true,
    message: "Shop deleted successfully",
  });
}
