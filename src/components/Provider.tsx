"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base, baseSepolia, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

const config = getDefaultConfig({
  appName: "BidCharter",
  projectId: "Project_id",
  chains: [base, baseSepolia, sepolia],
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

// "use client";

// import "@rainbow-me/rainbowkit/styles.css";
// import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { WagmiProvider } from "wagmi";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { ReactNode } from "react";
// // Import your custom chains
// import {
//   mainnet,
//   bscMainnet,
//   polygonMainnet,
//   baseMainnet,
//   optimismMainnet,
//   arbitrumMainnet,
// } from "@/libs/chainSetup"; // Adjust the path to where your chain definitions are
// import { Chain } from "wagmi/chains"; // Correct import for Chain type
// import { base, baseSepolia, sepolia } from "wagmi/chains"; // Default chains

// // Combine your custom chains with default chains
// const chains: readonly [Chain, ...Chain[]] = [
//   mainnet,
//   bscMainnet,
//   polygonMainnet,
//   baseMainnet,
//   optimismMainnet,
//   arbitrumMainnet,
//   base, // Optional: keep default wagmi chains
//   baseSepolia,
//   sepolia,
// ];

// const config = getDefaultConfig({
//   appName: "BidCharter",
//   projectId: "Project_id", // Replace with your actual WalletConnect Project ID
//   chains, // Use the combined chains array (TypeScript will infer correctly)
//   ssr: true, // Enable server-side rendering if needed
// });

// const queryClient = new QueryClient();

// function Provider({ children }: { children: ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider initialChain={sepolia}>
//           {children}
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }

// export default Provider;
