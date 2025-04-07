export const CharterAuctionABI = [
  {
    inputs: [
      { internalType: "address", name: "_usdt", type: "address" },
      { internalType: "uint256", name: "_entryFee", type: "uint256" },
      { internalType: "uint256", name: "_minRaisedFundsAtBlindRound", type: "uint256" },
      { internalType: "address", name: "_broker", type: "address" },
      { internalType: "address", name: "_nft", type: "address" },
      { internalType: "uint256", name: "_nftId", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "AuctionAlreadyEnded", type: "error" },
  { inputs: [], name: "BlindRoundEnded", type: "error" },
  { inputs: [], name: "BlindRoundStep", type: "error" },
  { inputs: [], name: "CannotEndBlindRound", type: "error" },
  { inputs: [], name: "DoubleBid", type: "error" },
  { inputs: [], name: "DoubleBlindBid", type: "error" },
  { inputs: [], name: "EndedAuction", type: "error" },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  { inputs: [], name: "InvalidBidInfo", type: "error" },
  { inputs: [], name: "InvalidEntryFee", type: "error" },
  { inputs: [], name: "InvalidMinPositions", type: "error" },
  { inputs: [], name: "InvalidMinRaisedFundsAtBlindRound", type: "error" },
  { inputs: [], name: "InvalidNFTAddress", type: "error" },
  { inputs: [], name: "InvalidNumberOfBidPrices", type: "error" },
  { inputs: [], name: "InvalidNumberOfPositions", type: "error" },
  { inputs: [], name: "InvalidNumberOfValues", type: "error" },
  { inputs: [], name: "InvalidPositionIndex", type: "error" },
  { inputs: [], name: "InvalidUSDTAddress", type: "error" },
  { inputs: [], name: "NoBidders", type: "error" },
  { inputs: [], name: "NoNFT", type: "error" },
  { inputs: [], name: "NoRewards", type: "error" },
  { inputs: [], name: "NotBlindRoundStep", type: "error" },
  { inputs: [], name: "NotBroker", type: "error" },
  { inputs: [], name: "NotWinner", type: "error" },
  { inputs: [], name: "RoundAlreadyEnded", type: "error" },
  { inputs: [], name: "RoundEnded", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  { inputs: [], name: "StillInBlindRound", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  { inputs: [], name: "ValueShouldBePositiveForGeometricMean", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "broker", type: "address" },
      { indexed: true, internalType: "uint256", name: "round", type: "uint256" },
      { indexed: true, internalType: "address", name: "usdt", type: "address" },
      { indexed: false, internalType: "uint256", name: "entryFee", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "minRaisedFundsAtBlindRound", type: "uint256" }
    ],
    name: "AuctionCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "round", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "positionIndex", type: "uint256" },
      { indexed: true, internalType: "address", name: "bidder", type: "address" },
      { indexed: false, internalType: "uint256", name: "entryFee", type: "uint256" }
    ],
    name: "BidPosition",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "round", type: "uint256" },
      { indexed: false, internalType: "uint256[]", name: "positionIndexes", type: "uint256[]" },
      { indexed: true, internalType: "address", name: "bidder", type: "address" },
      { indexed: false, internalType: "uint256", name: "entryFee", type: "uint256" }
    ],
    name: "BidPositions",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "round", type: "uint256" },
      { indexed: true, internalType: "address", name: "bidder", type: "address" },
      { indexed: false, internalType: "bytes32", name: "bidInfo", type: "bytes32" }
    ],
    name: "BlindBidEntered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "round", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "winningPrice", type: "uint256" },
      { indexed: true, internalType: "address", name: "winner", type: "address" }
    ],
    name: "EndAuction",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "winner", type: "address" }],
    name: "NFTWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "round", type: "uint256" }],
    name: "NewRoundStarted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "rewarder", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "RewardWithdrawn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "broker", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "RewardsWithdrawn",
    type: "event"
  },
  {
    inputs: [],
    name: "MIN_POSITIONS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "_bidInfo", type: "bytes32" }],
    name: "bidAtBlindRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "positionIndex", type: "uint256" }],
    name: "bidPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256[]", name: "positionIndexes", type: "uint256[]" }],
    name: "bidPositions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "blindRound",
    outputs: [{ internalType: "bool", name: "ended", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "broker",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "currentRound",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "endAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256[]", name: "_blindBidPrices", type: "uint256[]" }],
    name: "endBlindRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "entryFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256[]", name: "values", type: "uint256[]" }],
    name: "geometricMean",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getBlindBidder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "bidder", type: "address" }],
    name: "getBlindRoundBidInfo",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getBlindRoundBidders",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getRoundBidders",
    outputs: [{
      components: [
        { internalType: "address", name: "bidder", type: "address" },
        { internalType: "uint256[]", name: "bidPrices", type: "uint256[]" }
      ],
      internalType: "struct CharterAuction.BidderInfo",
      name: "",
      type: "tuple"
    }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getRoundBidders",
    outputs: [{
      components: [
        { internalType: "address", name: "bidder", type: "address" },
        { internalType: "uint256[]", name: "bidPrices", type: "uint256[]" }
      ],
      internalType: "struct CharterAuction.BidderInfo[]",
      name: "",
      type: "tuple[]"
    }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "index", type: "uint256" },
      { internalType: "uint256", name: "positionIndex", type: "uint256" }
    ],
    name: "getRoundBiddersBidPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getRoundBiddersBidPrices",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getRoundPosition",
    outputs: [{
      components: [
        { internalType: "address[]", name: "rewarders", type: "address[]" },
        { internalType: "uint256", name: "bidPrice", type: "uint256" }
      ],
      internalType: "struct CharterAuction.Position",
      name: "",
      type: "tuple"
    }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getRoundPositions",
    outputs: [{
      components: [
        { internalType: "address[]", name: "rewarders", type: "address[]" },
        { internalType: "uint256", name: "bidPrice", type: "uint256" }
      ],
      internalType: "struct CharterAuction.Position[]",
      name: "",
      type: "tuple[]"
    }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "positionIndex", type: "uint256" }],
    name: "getRoundPositionsBidPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "positionIndex", type: "uint256" }],
    name: "getRoundPositionsRewarders",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_round", type: "uint256" }],
    name: "getTargetPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "isBlindRoundEnded",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "isRoundEnded",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "minRaisedFundsAtBlindRound",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "nft",
    outputs: [{ internalType: "contract IERC721", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "nftId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "raisedFundAtBlindRound",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "rewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "rounds",
    outputs: [{ internalType: "bool", name: "ended", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "turnToNextRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "usdt",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "winner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "withdrawNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "withdrawRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "withdrawRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

export interface CharterAuction {
  // View Functions
  MIN_POSITIONS(): Promise<bigint>;
  blindRound(): Promise<{ ended: boolean }>;
  broker(): Promise<`0x${string}`>;
  currentRound(): Promise<bigint>;
  entryFee(): Promise<bigint>;
  geometricMean(values: readonly bigint[]): Promise<bigint>;
  getBlindBidder(index: bigint): Promise<`0x${string}`>;
  getBlindRoundBidInfo(bidder: `0x${string}`): Promise<`0x${string}`>;
  getBlindRoundBidders(): Promise<readonly `0x${string}`[]>;
  getRoundBidders(index: bigint): Promise<{
    bidder: `0x${string}`;
    bidPrices: readonly bigint[];
  }>;
  getRoundBidders(): Promise<readonly {
    bidder: `0x${string}`;
    bidPrices: readonly bigint[];
  }[]>;
  getRoundBiddersBidPrice(index: bigint, positionIndex: bigint): Promise<bigint>;
  getRoundBiddersBidPrices(index: bigint): Promise<readonly bigint[]>;
  getRoundPosition(index: bigint): Promise<{
    rewarders: readonly `0x${string}`[];
    bidPrice: bigint;
  }>;
  getRoundPositions(): Promise<readonly {
    rewarders: readonly `0x${string}`[];
    bidPrice: bigint;
  }[]>;
  getRoundPositionsBidPrice(positionIndex: bigint): Promise<bigint>;
  getRoundPositionsRewarders(positionIndex: bigint): Promise<readonly `0x${string}`[]>;
  getTargetPrice(round: bigint): Promise<bigint>;
  isBlindRoundEnded(): Promise<boolean>;
  isRoundEnded(): Promise<boolean>;
  minRaisedFundsAtBlindRound(): Promise<bigint>;
  nft(): Promise<`0x${string}`>;
  nftId(): Promise<bigint>;
  raisedFundAtBlindRound(): Promise<bigint>;
  rewards(address: `0x${string}`): Promise<bigint>;
  rounds(round: bigint): Promise<{ ended: boolean }>;
  totalRewards(): Promise<bigint>;
  usdt(): Promise<`0x${string}`>;
  winner(): Promise<`0x${string}`>;

  // State-Changing Functions
  bidAtBlindRound(bidInfo: `0x${string}`): Promise<void>;
  bidPosition(positionIndex: bigint): Promise<void>;
  bidPositions(positionIndexes: readonly bigint[]): Promise<void>;
  endAuction(): Promise<void>;
  endBlindRound(blindBidPrices: readonly bigint[]): Promise<void>;
  turnToNextRound(): Promise<void>;
  withdrawNFT(): Promise<void>;
  withdrawRewards(amount?: bigint): Promise<void>;
}

// Event Types
export type AuctionCreatedEvent = {
  broker: `0x${string}`;
  round: bigint;
  usdt: `0x${string}`;
  entryFee: bigint;
  minRaisedFundsAtBlindRound: bigint;
};

export type BidPositionEvent = {
  round: bigint;
  positionIndex: bigint;
  bidder: `0x${string}`;
  entryFee: bigint;
};

export type BidPositionsEvent = {
  round: bigint;
  positionIndexes: readonly bigint[];
  bidder: `0x${string}`;
  entryFee: bigint;
};

export type BlindBidEnteredEvent = {
  round: bigint;
  bidder: `0x${string}`;
  bidInfo: `0x${string}`;
};

export type EndAuctionEvent = {
  round: bigint;
  winningPrice: bigint;
  winner: `0x${string}`;
};

export type NFTWithdrawnEvent = {
  winner: `0x${string}`;
};

export type NewRoundStartedEvent = {
  round: bigint;
};

export type RewardWithdrawnEvent = {
  rewarder: `0x${string}`;
  amount: bigint;
};

export type RewardsWithdrawnEvent = {
  broker: `0x${string}`;
  amount: bigint;
};
