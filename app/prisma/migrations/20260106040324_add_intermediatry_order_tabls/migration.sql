-- CreateTable
CREATE TABLE "OrderIntermidates" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "OrderIntermidates_pkey" PRIMARY KEY ("id")
);
