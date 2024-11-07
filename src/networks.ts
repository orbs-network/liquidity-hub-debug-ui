import { erc20sData, zeroAddress } from "@defi.org/web3-candies";
import Linea from 'assets/linea.svg'
export const networks = {
  1: {
    id: 1,
    name: "Ethereum",
    shortname: "eth",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    },
    wToken: erc20sData.eth.WETH,
    publicRpcUrl: "https://eth.llamarpc.com",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    explorer: "https://etherscan.io",
  },
  56: {
    id: 56,
    name: "Bsc",
    shortname: "bsc",
    native: {
      address: zeroAddress,
      symbol: "BNB",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/bsc_2.svg",
    },
    wToken: erc20sData.bsc.WBNB,
    publicRpcUrl: "https://bsc-dataseed.binance.org",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/bsc_2.svg",
    explorer: "https://bscscan.com",
    eip1559: false,
  },
  137: {
    id: 137,
    name: "Polygon",
    shortname: "poly",
    native: {
      address: zeroAddress,
      symbol: "MATIC",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/polygon.svg",
    },
    wToken: erc20sData.poly.WMATIC,
    publicRpcUrl: "https://polygon-rpc.com",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/polygon.svg",
    explorer: "https://polygonscan.com",
    eip1559: true,
  },
  42161: {
    id: 42161,
    name: "Arbitrum",
    shortname: "arb",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    },
    wToken: erc20sData.arb.WETH,
    publicRpcUrl: "https://arb1.arbitrum.io/rpc",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/arbitrum.svg",
    explorer: "https://arbiscan.io",
    eip1559: true,
  },
  250: {
    id: 250,
    name: "Fantom",
    shortname: "ftm",
    native: {
      address: zeroAddress,
      symbol: "FTM",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/fantom.svg",
    },
    wToken: erc20sData.ftm.WFTM,
    publicRpcUrl: "https://rpc.ftm.tools",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/fantom.svg",
    explorer: "https://ftmscan.com",
    eip1559: true,
  },
  8453: {
    id: 8453,
    name: "Base",
    shortname: "base",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    },
    wToken: erc20sData.base.WETH,
    publicRpcUrl: "https://mainnet.base.org",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/base.svg",
    explorer: "https://basescan.org",
    eip1559: false,
  },
  59144: {
    id: 59144,
    name: "Linea",
    shortname: "linea",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    },
    wToken: erc20sData.linea.WETH,
    publicRpcUrl: "https://rpc.linea.build",
    logoUrl: Linea,
    explorer: "https://lineascan.build",
    eip1559: false,
  },
  1329: {
    id: 1329,
    name: "Sei",
    shortname: "sei",
    native: {
      address: zeroAddress,
      symbol: "SEI",
      decimals: 18,
      logoUrl: 'https://raw.githubusercontent.com/dragonswap-app/assets/main/logos/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE/logo.png',
    },
    wToken: {
      symbol: "WSEI",
      address: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
      decimals: 18,
      weth: false,
      logoUrl: "https://raw.githubusercontent.com/dragonswap-app/assets/main/logos/0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7/logo.png",
    },
    publicRpcUrl: "https://evm-rpc.sei-apis.com",
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/128x128/23149.png",
    explorer: "https://seitrace.com",
    eip1559: false,
  },
};


// export const dexConfig = {
//   quickswap: {
//     chainId: 137,
//     website: "https://quickswap.exchange/",
//     logoUrl: Quickswap,
//     name:'Quickswap'
//   },
//   spookyswap: {
//     chainId: 250,
//     website: "https://spooky.fi/",
//     logoUrl: Spookyswap,
//     name:'Spookyswap'
//   },
//   lynex: {
//     chainId: 59144,
//     website: "https://www.lynex.fi/",
//     logoUrl: Lynex,
//     name:'Lynex'
//   },
//   thena: {
//     chainId: 56,
//     website: "https://thena.fi/",
//     logoUrl: Thena,
//     name:'Thena'
//   },
//   intentx: {
//     chainId: 8453,
//     website: "https://intentx.io/",
//     logoUrl: Intentx,
//     name:'Intentx'
//   },
//   fenix: {
//     chainId: 81457,
//     website: "https://blast.io/en",
//     logoUrl: Blast,
//     name:'Blast'
//   },
//   arbidex: {
//     chainId: 42161,
//     website: "https://arbidex.fi/",
//     logoUrl: Blast,
//     name:'Arbidex'
//   },
//   pangolin: {
//     chainId: 43114,
//     website: "https://s2.coinmarketcap.com/static/img/coins/128x128/8422.png",
//     logoUrl: Blast,
//     name:'Pangolin'
//   },
//   chronos: {
//     chainId: 42161,
//     website: "https://chronos.exchange/",
//     logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/128x128/24158.png',
//     name:'Chronos'
//   },
//   baseswap: {
//     chainId: 8453,
//     website: "https://baseswap.fi/",
//     logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/128x128/27764.png',
//     name:'Baseswap'
//   },
//   pancakeswap: {
//     chainId: 56,
//     website: "https://baseswap.fi/",
//     logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/128x128/7186.png',
//     name:'PancakeSwap'
//   },
//   syncswap: {
//     chainId: 324,
//     website: "https://baseswap.fi/",
//     logoUrl: 'https://s2.coinmarketcap.com/static/img/exchanges/128x128/6813.png',
//     name:'SyncSwap'
//   },
//   sushiswap: {
//     chainId: 42161,
//     website: "https://www.sushi.com",
//     logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/128x128/6758.png',
//     name:'SushiSwap'
//   },
//   dragonswap: {
//     chainId: 1329,
//     website: "https://dragonswap.app",
//     logoUrl: 'https://s2.coinmarketcap.com/static/img/exchanges/128x128/10363.png',
//     name:'DragonSwap'
//   },
// };
