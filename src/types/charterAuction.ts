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

export type { InfoRowProps, NFTMetadataAttributes, NFTMetadata };
