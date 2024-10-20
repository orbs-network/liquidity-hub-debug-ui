import { network } from "@defi.org/web3-candies";

export const CHAINS = [
  {
    title: "Ethereum",
    id: 1,
    native: network(1).native,
    wToken: network(1).wToken,
    logo: network(1).logoUrl,
    explorer: network(1).explorer,
  },
  {
    title: "Polygon",
    id: 137,
    native: network(137).native,
    wToken: network(137).wToken,
    logo: network(137).logoUrl,
    explorer: network(137).explorer,
  },
  {
    title: "BSC",
    id: 56,
    native: network(56).native,
    wToken: network(56).wToken,
    logo: network(56).logoUrl,
    explorer: network(56).explorer,
  },
  {
    title: "FTM",
    id: 250,
    native: network(250).native,
    wToken: network(250).wToken,
    logo: network(250).logoUrl,
    explorer: network(250).explorer,
  },
  {
    title: "Linea",
    id: 59144,
    native: network(59144).native,
    wToken: network(59144).wToken,
    logo: network(59144).logoUrl,
    explorer: network(59144).explorer,

  },
  {
    title: "Base",
    id: 8453,
    native: network(8453).native,
    wToken: network(8453).wToken,
    logo: network(8453).logoUrl,
    explorer: network(8453).explorer,

  },
];
