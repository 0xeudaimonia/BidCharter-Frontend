export type InfoRowProps = {
  label: string;
  value: string;
  bold?: boolean;
};

export type YachtInfo = {
  title: string;
  image: string;
  details: InfoRowProps[];
};

export type NFTMetadataAttributes = {
  trait_type: string;
  value: string;
};

export type NFTMetadata = {
  name?: string;
  image?: string;
  attributes?: NFTMetadataAttributes[];
};

export type ChartData = {
  round: string;
  price: number;
  leftBid: number;
  rightBid: number;
};

export type BarData = {
  round: string;
  price: number;
  fillValue: number;
};

export type Position = {
  seat: string;
  price: string;
};

export type RoundInfo = {
  title: string;
  round: string;
  myPosition: string;
  targetPrice: string;
  actionsLeft: string;
  myStake: string;
  auctionTime: string;  
};

export type RoundInfoItem = {
  label: string;
  value: string;
};

export type ChartDataItem = {
  round: string;
  price: number;
  leftBid: number;
  rightBid: number;
};

export type GraphbarItem = {
  round: string;
  price: number;
  fillValue: number;
};


export type BlindBidInfo = {
  auctionAddress: string;
  bidder: string;
  createdAt: string;
  id: number;
  price: string;
  updatedAt: string;
};

export type BlindBidFetchResponse = {
  data?: BlindBidInfo[];
  error?: string;
};

export type BidAtBlindRoundResponse = {
  message?: string;
  error?: string;
};