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
  rewarders: `0x${string}`[];
  bidPrice: bigint;
};

export type { InfoRowProps, NFTMetadataAttributes, NFTMetadata, ChartData, BarData, Position };
