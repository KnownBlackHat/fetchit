import { Router } from "express";
import { userMiddleWare } from "@/middlewares/user";
import {
  acceptDelivery,
  completeOrder,
  getDeliveryId,
  getDeliveryList,
  getOrderStatus,
  getOrderStatusDelivery,
  getUserActiveOrder,
  getUserHistoryOrder,
  getVendorActiveOrder,
  getVendorHistoryOrder,
  placeOrder,
} from "@/controllers/order";
import { errorHandler } from "@/utils/errorHandler";
import { vendorMiddleWare } from "@/middlewares/vendor";
import { deliveryMiddleWare } from "@/middlewares/deliveryBoy";

export const orderRouter = Router();

orderRouter.get("/active", userMiddleWare, errorHandler(getUserActiveOrder));
orderRouter.get("/history", userMiddleWare, errorHandler(getUserHistoryOrder));

orderRouter.get(
  "/vendor/active",
  vendorMiddleWare,
  errorHandler(getVendorActiveOrder),
);
orderRouter.get(
  "/vendor/history",
  vendorMiddleWare,
  errorHandler(getVendorHistoryOrder),
);

orderRouter.post("/:shopid", userMiddleWare, errorHandler(placeOrder));

// DELIVERY PART
orderRouter.get(
  "/status/:orderid",
  userMiddleWare,
  errorHandler(getOrderStatus),
);
orderRouter.get(
  "/complete/:orderid",
  deliveryMiddleWare,
  errorHandler(completeOrder),
);
orderRouter.get(
  "/delivery/status/:orderid",
  deliveryMiddleWare,
  errorHandler(getOrderStatusDelivery),
);

orderRouter.get(
  "/delivery/get_delivery/:orderid",
  deliveryMiddleWare,
  errorHandler(getDeliveryId),
);
orderRouter.get(
  "/delivery/list_orders",
  deliveryMiddleWare,
  errorHandler(getDeliveryList),
);
orderRouter.get(
  "/delivery/accept/:orderid",
  deliveryMiddleWare,
  errorHandler(acceptDelivery),
);
