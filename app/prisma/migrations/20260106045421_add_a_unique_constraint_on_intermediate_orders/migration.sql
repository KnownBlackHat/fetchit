/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `OrderIntermidates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderIntermidates_orderId_key" ON "OrderIntermidates"("orderId");
