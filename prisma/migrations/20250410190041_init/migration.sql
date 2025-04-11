/*
  Warnings:

  - You are about to drop the column `amount` on the `BidderInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BidderInfo" DROP COLUMN "amount",
ADD COLUMN     "price" TEXT;
