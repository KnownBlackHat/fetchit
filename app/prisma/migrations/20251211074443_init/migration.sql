-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Canteen', 'Den', 'Ration', 'Essential', 'Resturant');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_no" BIGINT NOT NULL,
    "mail_id" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_no" BIGINT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "shop_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rating_count" BIGINT NOT NULL DEFAULT 0,
    "phone_no" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "total_seat" INTEGER,
    "available_seat" INTEGER,
    "total_revenue" BIGINT NOT NULL DEFAULT 0,
    "commission" BIGINT NOT NULL DEFAULT 0,
    "avg_order_value" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_no" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rating_count" BIGINT NOT NULL DEFAULT 0,
    "image_url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "landmark" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrdersHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserOrdersHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActiveOrder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "UserActiveOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorOrderHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "shopId" TEXT,

    CONSTRAINT "VendorOrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorActiveOrder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "shopId" TEXT,

    CONSTRAINT "VendorActiveOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_username_key" ON "Shop"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_username_key" ON "Delivery"("username");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrdersHistory" ADD CONSTRAINT "UserOrdersHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActiveOrder" ADD CONSTRAINT "UserActiveOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrderHistory" ADD CONSTRAINT "VendorOrderHistory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorActiveOrder" ADD CONSTRAINT "VendorActiveOrder_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
