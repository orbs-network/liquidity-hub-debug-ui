import { Config, Configs, networks } from "@orbs-network/twap-sdk";
import _ from "lodash";

export class Partner {
  public twapPartner: string;
  constructor(
    public website: string,
    public logoUrl: string,
    public name: string,
    public twapConfigs: Config[],
    public id: string,
    public liquidityHubChains: number[]
  ) {
    this.twapPartner = twapConfigs.length > 0 ? twapConfigs[0].partner : "";
  }
  isSupportedTwap(chainId?: number) {
    if (!chainId) return false;
    return this.twapConfigs.some((config) => config.chainId === chainId);
  }
  isSupportedLH(chainId?: number) {
    if (!chainId) return false;
    return this.liquidityHubChains.includes(chainId);
  }
}


const groupedConfigsByName = _.groupBy(
  Object.values(Configs),
  "partner"
) as Record<string, Config[]>;
const getTwapConfigs = (partner: string): Config[] => {
  return groupedConfigsByName[partner] || [];
};
export const partners: Record<string, Partner> = {
  swapx: new Partner(
    "https://swapx.fi",
    "https://s2.coinmarketcap.com/static/img/coins/64x64/34753.png",
    "SwapX",
    getTwapConfigs(Configs.SwapX.partner),
    "swapx",
    [networks.sonic.id]
  ),
  quickswap: new Partner(
    "https://quickswap.exchange/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/19966.png",
    "Quickswap",
    getTwapConfigs(Configs.QuickSwap.partner),
    "quickswap",
    [networks.poly.id, networks.eth.id]
  ),
  spookyswap: new Partner(
    "https://spooky.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/1455.png",
    "Spookyswap",
    getTwapConfigs(Configs.SpookySwap.partner),
    "spookyswap",
    [networks.ftm.id, networks.sonic.id]
  ),
  lynex: new Partner(
    "https://www.lynex.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7957.png",
    "Lynex",
    getTwapConfigs(Configs.Lynex.partner),
    "lynex",
    [networks.linea.id]
  ),
  thena: new Partner(
    "https://thena.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/5803.png",
    "Thena",
    getTwapConfigs(Configs.Thena.partner),
    "thena",
    [networks.bsc.id]
  ),
  arbidex: new Partner(
    "https://arbidex.fi/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/6506.png",
    "Arbidex",
    getTwapConfigs(Configs.Arbidex.partner),
    "arbidex",
    [networks.arb.id]
  ),

  chronos: new Partner(
    "https://chronos.exchange/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/24158.png",
    "Chronos",
    getTwapConfigs(Configs.Chronos.partner),  
    "chronos",
    []
  ),
  baseswap: new Partner(
    "https://baseswap.fi/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/27764.png",
    "Baseswap",
    getTwapConfigs(Configs.BaseSwap.partner),
    "baseswap",
    []
  ),
  pancakeswap: new Partner(
    "https://baseswap.fi/",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/7186.png",
    "PancakeSwap",
    getTwapConfigs(Configs.PancakeSwap.partner),
    "pancakeswap",
    []
  ),
  sushiswap: new Partner(
    "https://www.sushi.com",
    "https://s2.coinmarketcap.com/static/img/coins/128x128/6758.png",
    "SushiSwap",
    getTwapConfigs(Configs.SushiBase.partner),
    "sushiswap",
    []
  ),
  dragonswap: new Partner(
    "https://dragonswap.app",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/10363.png",
    "DragonSwap",
    getTwapConfigs(Configs.DragonSwap.partner),
    "dragonswap",
    [networks.sei.id]
  ),
  retro: new Partner(
    "https://retro.finance/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7516.png",
    "Retro",
    getTwapConfigs(Configs.Retro.partner),
    "retro",
    []
  ),
  fenix: new Partner(
    "https://fenix.finance/",
    "https://s2.coinmarketcap.com/static/img/exchanges/128x128/7516.png",
    "Fenix",
    [],
    "fenix",
    [networks.blast.id]
  ),
};


