-- CreateTable
CREATE TABLE "BidderInfo" (
    "id" SERIAL NOT NULL,
    "auctionAddress" TEXT,
    "bidder" TEXT,
    "amount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BidderInfo_pkey" PRIMARY KEY ("id")
);
