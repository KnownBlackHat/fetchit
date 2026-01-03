/*
  Warnings:

  - You are about to drop the `OrderIntermidates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserActiveOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOrdersHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorActiveOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorOrderHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `retail_price` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DELIVERED');

-- DropForeignKey
ALTER TABLE "UserActiveOrder" DROP CONSTRAINT "UserActiveOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrdersHistory" DROP CONSTRAINT "UserOrdersHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "VendorActiveOrder" DROP CONSTRAINT "VendorActiveOrder_shopId_fkey";

-- DropForeignKey
ALTER TABLE "VendorOrderHistory" DROP CONSTRAINT "VendorOrderHistory_shopId_fkey";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "retail_price" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "OrderIntermidates";

-- DropTable
DROP TABLE "UserActiveOrder";

-- DropTable
DROP TABLE "UserOrdersHistory";

-- DropTable
DROP TABLE "VendorActiveOrder";

-- DropTable
DROP TABLE "VendorOrderHistory";

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "totalprice" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" TEXT NOT NULL,
    "deliveryId" TEXT,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtTime" DOUBLE PRECISION NOT NULL,
    "ordersId" TEXT,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "UserAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "Orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
