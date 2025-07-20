import { networks as _networks } from "@orbs-network/twap-sdk";

export const networks = {
  ..._networks,
  [_networks.arb.shortname]: {
    ..._networks.arb,
    logoUrl: "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242",
  },
 

};