/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "OrderIntermidates" (
    "id" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,

    CONSTRAINT "OrderIntermidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAddress_userId_key" ON "UserAddress"("userId");
