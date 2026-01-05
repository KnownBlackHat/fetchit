import { Router } from "express";
import { userMiddleWare } from "@/middlewares/user";
import { completeOrder, getOrderStatus, getUserActiveOrder, getUserHistoryOrder, getVendorActiveOrder, getVendorHistoryOrder, placeOrder } from "@/controllers/order";
import { errorHandler } from "@/utils/errorHandler";
import { vendorMiddleWare } from "@/middlewares/vendor";
import { deliveryMiddleWare } from "@/middlewares/deliveryBoy";

export const orderRouter = Router();

orderRouter.get("/active", userMiddleWare, errorHandler(getUserActiveOrder));
orderRouter.get("/history", userMiddleWare, errorHandler(getUserHistoryOrder));

orderRouter.get("/vendor/active", vendorMiddleWare, errorHandler(getVendorActiveOrder));
orderRouter.get("/vendor/history", vendorMiddleWare, errorHandler(getVendorHistoryOrder));

orderRouter.post("/:shopid", userMiddleWare, errorHandler(placeOrder));

// DELIVERY PART
orderRouter.get("/complete/:orderid", deliveryMiddleWare, errorHandler(completeOrder));
orderRouter.get("/status/:orderid", userMiddleWare, errorHandler(getOrderStatus));
orderRouter.get("/delivery/status/:orderid", deliveryMiddleWare, errorHandler(getOrderStatus));
