import { eqIgnoreCase } from "@defi.org/web3-candies";
import { Config, Configs } from "@orbs-network/twap-sdk";
import _ from "lodash";
import { networks } from "networks";

const getExchange = (partner: string) => {
  return (
    _.filter(
      Configs,
      (config) => _.last(config.partner.split(":"))?.toLowerCase() === partner
    ) || []
  );
};

export class Partner {
  configs: Config[];
  twapChains: number[];
  constructor(
    public website: string,
    public logoUrl: string,
    public name: string,
    exchangesKey: string,
    public liquidityHubChains: number[]
  ) {
    this.configs = getExchange(exchangesKey);
    this.twapChains = this.configs.map((config) => config.chainId);
  }
  supportsTwap(chainId?: number) {
    return !chainId ? false : this.twapChains.includes(chainId);
  }
  supportsLiquidityHub(chainId?: number) {
    return !chainId ? false : this.liquidityHubChains.includes(chainId);
  }

  getTwapConfigByExchange(exchangeAddress = "") {
    return this.configs.find((config) =>
      eqIgnoreCase(config.exchangeAddress, exchangeAddress)
    );
  }
  getTwapConfigByChainId(chainId?: number) {
    return this.configs.find((config) => config.chainId === chainId);
  }
}

export const partners: { [key: string]: Partner } = {
  quickswap: new Partner(
    "https://quickswap.exchange/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/1293.png",
    "Quickswap",
    "quickswap",
    [networks.poly.id, networks.eth.id]
  ),
  spookyswap: new Partner(
    "https://spooky.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/1455.png",
    "Spookyswap",
    "spookyswap",
    [networks.ftm.id]
  ),
  lynex: new Partner(
    "https://www.lynex.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7957.png",
    "Lynex",
    "lynex",
    [networks.linea.id]
  ),
  thena: new Partner(
    "https://thena.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/5803.png",
    "Thena",
    "thena",
    [networks.bsc.id]
  ),
  arbidex: new Partner(
    "https://arbidex.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/6506.png",
    "Arbidex",
    "arbidex",
    [networks.arb.id]
  ),
  pangolin: new Partner(
    "https://s2.coinmarketcap.com/static/img/coins/128x128/8422.png",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/1340.png",
    "Pangolin",
    "pangolin",
    []
  ),
  chronos: new Partner(
    "https://chronos.exchange/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/24158.png",
    "Chronos",
    "chronos",
    []
  ),
  baseswap: new Partner(
    "https://baseswap.fi/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/27764.png",
    "Baseswap",
    "baseswap",
    []
  ),
  pancakeswap: new Partner(
    "https://baseswap.fi/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/7186.png",
    "PancakeSwap",
    "pancakeswap",
    []
  ),
  sushiswap: new Partner(
    "https://www.sushi.com",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/6758.png",
    "SushiSwap",
    "sushi",
    []
  ),
  dragonswap: new Partner(
    "https://dragonswap.app",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/10363.png",
    "DragonSwap",
    "dragonswap",
    []
  ),
  retro: new Partner(
    "https://retro.finance/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7516.png",
    "Retro",
    "retro",
    []
  ),
  fenix: new Partner(
    "https://fenix.finance/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7516.png",
    "Fenix",
    "fenix",
    [networks.blast.id]
  ),
};
