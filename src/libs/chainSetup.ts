import { type Chain } from "viem";

const mainnet_rpc = process.env.NEXT_PUBLIC_MAINNET_RPC_ENDPOINT as string;
const bsc_mainnet_rpc = process.env
  .NEXT_PUBLIC_BSC_MAINNET_RPC_ENDPOINT as string;
const polygon_mainnet_rpc = process.env
  .NEXT_PUBLIC_POLYGON_MAINNET_RPC_ENDPOINT as string;
const base_mainnet_rpc = process.env
  .NEXT_PUBLIC_BASE_MAINNET_RPC_ENDPOINT as string;
const optimism_mainnet_rpc = process.env
  .NEXT_PUBLIC_OPTIMISM_MAINNET_RPC_ENDPOINT as string;
const arbitrum_mainnet_rpc = process.env
  .NEXT_PUBLIC_ARBITRUM_MAINNET_RPC_ENDPOINT as string;

export const mainnet = {
  id: 1,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [mainnet_rpc] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
  contracts: {
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    },
    ensUniversalResolver: {
      address: "0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da",
      blockCreated: 16773775,
    },
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601,
    },
  },
} as const satisfies Chain;

export const bscMainnet = {
  id: 56,
  name: "Binance Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: { http: [bsc_mainnet_rpc] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
  contracts: {
    multicall3: {
      // Example address; this is one of the known multicall contracts on BSC.
      address: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb",
      blockCreated: 11000000,
    },
  },
} as const satisfies Chain;

export const polygonMainnet = {
  id: 137,
  name: "Polygon",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: { http: [polygon_mainnet_rpc] },
  },
  blockExplorers: {
    default: { name: "Polygonscan", url: "https://polygonscan.com" },
  },
  contracts: {
    multicall3: {
      address: "0x275617327c958bD06b5D6b871E7f491D76113dd8",
      blockCreated: 20600000, // Example block number; update as needed.
    },
  },
} as const satisfies Chain;

export const baseMainnet = {
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [base_mainnet_rpc] },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
  },
  contracts: {
    multicall3: {
      // Replace this address with a deployed multicall contract on Base, if available.
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 0, // Update with the actual block number when deployed.
    },
  },
} as const satisfies Chain;

export const optimismMainnet = {
  id: 10,
  name: "Optimism",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [optimism_mainnet_rpc] },
  },
  blockExplorers: {
    default: {
      name: "Optimistic Etherscan",
      url: "https://optimistic.etherscan.io",
    },
  },
  contracts: {
    multicall3: {
      // Replace this placeholder address with the actual multicall contract address on Optimism.
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 0, // Update with the actual block number when the multicall contract was deployed.
    },
  },
} as const satisfies Chain;

export const arbitrumMainnet = {
  id: 42161,
  name: "Arbitrum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [arbitrum_mainnet_rpc] },
  },
  blockExplorers: {
    default: { name: "Arbitrum Etherscan", url: "https://arbiscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 0, // Update with the actual block number when the multicall contract was deployed.
    },
  },
} as const satisfies Chain;
