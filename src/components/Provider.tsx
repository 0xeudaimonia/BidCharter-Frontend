"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
// import { base, baseSepolia, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { baseMainnet, baseSepolia, sepolia } from "@/src/libs/chain";

const config = getDefaultConfig({
  appName: "BidCharter",
  projectId: "Project_id",
  chains: [sepolia, baseMainnet, baseSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

function Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={sepolia}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Provider;
