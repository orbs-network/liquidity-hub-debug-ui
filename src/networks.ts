import { networks as _networks } from "@orbs-network/twap-sdk";

export const networks = {
  ..._networks,
  [_networks.arb.shortname]: {
    ..._networks.arb,
    logoUrl: "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242",
  },
  [_networks.linea.shortname]: {
    ..._networks.linea,
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/128x128/27657.png",
  },
 
  [_networks.poly.shortname]: {
    ..._networks.poly,
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/128x128/3890.png",
  },
  [_networks.ftm.shortname]: {
    ..._networks.ftm,
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/128x128/3513.png",
  },
 

};