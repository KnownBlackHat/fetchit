import { Router } from "express";
import { vendorMiddleWare } from "../../middlewares/vendor";
import { userMiddleWare } from "../../middlewares/user";
import { errorHandler } from "@/utils/errorHandler";
import {
  addInventoryHandler,
  deleteItems,
  deleteShop,
  getInventoryItemsByShopId,
  getRestaurantSeat,
  getShopByCategory,
  getShopsList,
  patchRestaurantSeat,
} from "@/controllers/shop";

export const shopRouter = Router();

shopRouter.get("/", userMiddleWare, errorHandler(getShopsList));

shopRouter.get(
  "/resturant/seat",
  vendorMiddleWare,
  errorHandler(getRestaurantSeat),
);

shopRouter.get("/:category", userMiddleWare, errorHandler(getShopByCategory));

shopRouter.get(
  "/inventory/:shopid",
  userMiddleWare,
  errorHandler(getInventoryItemsByShopId),
);

shopRouter.post(
  "/inventory",
  vendorMiddleWare,
  errorHandler(addInventoryHandler),
);

shopRouter.patch(
  "/resturant/seat",
  vendorMiddleWare,
  errorHandler(patchRestaurantSeat),
);

shopRouter.delete(
  "/inventory/:itemid",
  vendorMiddleWare,
  errorHandler(deleteItems),
);

shopRouter.delete("/", vendorMiddleWare, errorHandler(deleteShop));
