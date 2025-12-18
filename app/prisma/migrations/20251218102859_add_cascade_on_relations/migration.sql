-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_shopId_fkey";

-- DropForeignKey
ALTER TABLE "UserActiveOrder" DROP CONSTRAINT "UserActiveOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrdersHistory" DROP CONSTRAINT "UserOrdersHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "VendorActiveOrder" DROP CONSTRAINT "VendorActiveOrder_shopId_fkey";

-- DropForeignKey
ALTER TABLE "VendorOrderHistory" DROP CONSTRAINT "VendorOrderHistory_shopId_fkey";

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrdersHistory" ADD CONSTRAINT "UserOrdersHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActiveOrder" ADD CONSTRAINT "UserActiveOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrderHistory" ADD CONSTRAINT "VendorOrderHistory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorActiveOrder" ADD CONSTRAINT "VendorActiveOrder_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
