"use client";

import { ReactNode } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { hardhat, goerli, sepolia} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const chain = process.env.NEXT_PUBLIC_CHAIN_ID === "11155111" ? sepolia : hardhat;
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chain],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "",
    }),
    publicProvider(),
  ],
);
const { connectors } = getDefaultWallets({
  appName: "Solidity Next.js Starter",
  projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID ?? "",
  chains,
});
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const Providers = ({ children }: { children: ReactNode }) => (
  <WagmiConfig config={config}>
    <RainbowKitProvider chains={chains}theme={darkTheme({
      accentColor: '#22c55e',
      accentColorForeground: 'white',
      fontStack: 'rounded',
      overlayBlur: 'small',
    })}>{children}</RainbowKitProvider>
  </WagmiConfig>
);

export { Providers };
