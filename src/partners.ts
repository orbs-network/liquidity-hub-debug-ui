import { eqIgnoreCase } from "@defi.org/web3-candies";
import { Config, Configs } from "@orbs-network/twap-sdk";
import _ from "lodash";

const getExchange = (partner: string) => {
  return (
    _.filter(
      Configs,
      (config) => _.last(config.partner.split(":"))?.toLowerCase() === partner
    ) || []
  );
};

export class Partner {
  exchanges: Config[];
  constructor(
    public website: string,
    public logoUrl: string,
    public name: string,
    exchangesKey: string
  ) {
    this.exchanges = getExchange(exchangesKey);
  }
  isChainSupported(chainId?: number) {
    return this.exchanges.some((exchange) => exchange.chainId === chainId);
  }
  getExchangeByChainId(chainId?: number) {
    return this.exchanges.find((exchange) => exchange.chainId === chainId);
  }
  getExchangeByAddress(address = '') {
    return this.exchanges.find((exchange) => eqIgnoreCase(exchange.exchangeAddress , address));
  }
  isExchangeExists(exchangeAddress = "") {
    return this.exchanges.some((exchange) =>
      eqIgnoreCase(exchange.exchangeAddress, exchangeAddress)
    );
  }
  getConfig(exchangeAddress = "") {
    return this.exchanges.find((exchange) =>
      eqIgnoreCase(exchange.exchangeAddress, exchangeAddress)
    );
  }
}

export const partners: { [key: string]: Partner } = {
  quickswap: new Partner(
    "https://quickswap.exchange/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/1293.png",
    "Quickswap",
    "quickswap"
  ),
  spookyswap: new Partner(
    "https://spooky.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/1455.png",
    "Spookyswap",
    "spookyswap"
  ),
  lynex: new Partner(
    "https://www.lynex.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7957.png",
    "Lynex",
    "lynex"
  ),
  thena: new Partner(
    "https://thena.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/5803.png",
    "Thena",
    "thena"
  ),
  arbidex: new Partner(
    "https://arbidex.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/6506.png",
    "Arbidex",
    "arbidex"
  ),
  pangolin: new Partner(
    "https://s2.coinmarketcap.com/static/img/coins/128x128/8422.png",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/1340.png",
    "Pangolin",
    "pangolin"
  ),
  chronos: new Partner(
    "https://chronos.exchange/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/24158.png",
    "Chronos",
    "chronos"
  ),
  baseswap: new Partner(
    "https://baseswap.fi/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/27764.png",
    "Baseswap",
    "baseswap"
  ),
  pancakeswap: new Partner(
    "https://baseswap.fi/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/7186.png",
    "PancakeSwap",
    "pancakeswap"
  ),
  syncswap: new Partner(
    "https://baseswap.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/6813.png",
    "SyncSwap",
    "syncswap"
  ),
  sushiswap: new Partner(
    "https://www.sushi.com",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/6758.png",
    "SushiSwap",
    "sushi"
  ),
  dragonswap: new Partner(
    "https://dragonswap.app",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/10363.png",
    "DragonSwap",
    "dragonswap"
  ),
  retro: new Partner(
    "https://retro.finance/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7516.png",
    "Retro",
    "retro"
  ),
};
