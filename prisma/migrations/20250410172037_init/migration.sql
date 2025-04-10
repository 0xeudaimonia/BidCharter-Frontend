/*
  Warnings:

  - A unique constraint covering the columns `[auctionAddress,bidder]` on the table `BidderInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BidderInfo_auctionAddress_bidder_key" ON "BidderInfo"("auctionAddress", "bidder");
