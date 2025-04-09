type InfoRowProps = {
  label: string;
  value: string;
  bold?: boolean;
};

type NFTMetadataAttributes = {
  trait_type: string;
  value: string;
};

type NFTMetadata = {
  name?: string;
  image?: string;
  attributes?: NFTMetadataAttributes[];
};

type ChartData = {
  round: string;
  price: number;
  leftBid: number;
  rightBid: number;
};

type BarData = {
  round: string;
  price: number;
  fillValue: number;
};

type Position = {
  seat: string;
  price: string;
};

type RoundInfo = {
  title: string;
  round: string;
  myPosition: string;
  targetPrice: string;
  actionsLeft: string;
  myStake: string;
  auctionTime: string;  
};

type RoundInfoItem = {
  label: string;
  value: string;
};

type ChartDataItem = {
  round: string;
  price: number;
  leftBid: number;
  rightBid: number;
};

type GraphbarItem = {
  round: string;
  price: number;
  fillValue: number;
};


export type { InfoRowProps, NFTMetadataAttributes, NFTMetadata, ChartData, BarData, Position, RoundInfo, RoundInfoItem, ChartDataItem, GraphbarItem };
