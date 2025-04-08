export type InputValues = Record<string, string>;

export type Auction = {
  auctionId: number;
  auctionAddress: `0x${string}`;
  time: string;
};

export type FetchAuctionAddresses = {
  data: { result: `0x${string}` }[];
  refetch: () => void;
  isLoading: boolean;
  error: Error | null;
};

export type AuctionInfo = {
  title: string;
  round: number;
  myPosition: string;
  targetPrice: string;
  actionsLeft: number;
  myStake: string;
  auctionTime: string;
};

export type InputDetail = {
  inputLabel: string;
  priceTag: string;
};

