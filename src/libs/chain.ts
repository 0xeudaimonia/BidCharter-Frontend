import { type Chain } from "viem";

const base_mainnet_rpc = process.env
  .NEXT_PUBLIC_BASE_MAINNET_RPC_ENDPOINT as string;
const sepolia_rpc = process.env
  .NEXT_PUBLIC_SEPOLIA_RPC_ENDPOINT as string;
const base_sepolia_rpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_ENDPOINT as string;
  
export const baseMainnet = {
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [base_mainnet_rpc] },
  },
  blockExplorers: {
    default: { name: "Base Explorer", url: "https://basescan.org" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1371686, 
    },
  },
} as const satisfies Chain;

export const baseSepolia = {
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [base_sepolia_rpc] },
  },
  blockExplorers: {
    default: { name: "Base Sepolia Explorer", url: "https://sepolia.basescan.org" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 5022557,
    },
  },
} as const satisfies Chain;

export const sepolia = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [sepolia_rpc] },
  },
  blockExplorers: {
    default: { name: "Sepolia Etherscan", url: "https://sepolia.etherscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 0, // Update with the actual block number when the multicall contract was deployed.
    },
  },
} as const satisfies Chain;

