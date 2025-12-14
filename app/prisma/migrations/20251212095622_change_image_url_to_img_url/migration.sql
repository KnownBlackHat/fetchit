/*
  Warnings:

  - You are about to drop the column `image_url` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `UserActiveOrder` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `UserOrdersHistory` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `VendorActiveOrder` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `VendorOrderHistory` table. All the data in the column will be lost.
  - Added the required column `img_url` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_url` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_url` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_url` to the `UserActiveOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_url` to the `UserOrdersHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_url` to the `VendorActiveOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_url` to the `VendorOrderHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "image_url",
ADD COLUMN     "img_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "image_url",
ADD COLUMN     "img_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "image_url",
ADD COLUMN     "img_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "img_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserActiveOrder" DROP COLUMN "image_url",
ADD COLUMN     "img_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserOrdersHistory" DROP COLUMN "image_url",
ADD COLUMN     "img_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VendorActiveOrder" DROP COLUMN "image_url",
ADD COLUMN     "img_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VendorOrderHistory" DROP COLUMN "image_url",
ADD COLUMN     "img_url" TEXT NOT NULL;
