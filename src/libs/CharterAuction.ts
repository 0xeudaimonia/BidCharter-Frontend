export const charterAuctionAbi = [
    {
      type: "constructor",
      inputs: [
        {
          name: "_usdt",
          type: "address",
          internalType: "address",
        },
        {
          name: "_entryFee",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_minRaisedFundsAtBlindRound",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_broker",
          type: "address",
          internalType: "address",
        },
        {
          name: "_nft",
          type: "address",
          internalType: "address",
        },
        {
          name: "_nftId",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "MIN_POSITIONS",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "bidAtBlindRound",
      inputs: [
        {
          name: "_bidInfo",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "bidPosition",
      inputs: [
        {
          name: "positionIndex",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "bidPositions",
      inputs: [
        {
          name: "positionIndexes",
          type: "uint256[]",
          internalType: "uint256[]",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "blindRound",
      inputs: [],
      outputs: [
        {
          name: "ended",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
  ];
