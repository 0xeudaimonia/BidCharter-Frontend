import { CharterAuctionTypes } from "../types";

export const fetchBlindBidInfos = async (auctionAddress: string): Promise<CharterAuctionTypes.BlindBidFetchResponse> => {
  const response = await fetch(`/api/bidInfo?auctionAddress=${auctionAddress}`, {
    method: "GET",
  });

  const result = await response.json();

  return result;
};

export const saveBidderInfo = async (auctionAddress: string, bidder: string, price: string): Promise<CharterAuctionTypes.BidAtBlindRoundResponse> => {
  const response = await fetch("/api/bidInfo", {
    method: "POST",
    body: JSON.stringify({
      auctionAddress: auctionAddress,
      bidder: bidder,
      price: price,
    }),
  });

  const result = await response.json();

  return result;
};