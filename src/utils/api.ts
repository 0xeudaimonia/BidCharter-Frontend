export const saveBidderInfo = async (auctionAddress: string, bidder: string, price: string) => {
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