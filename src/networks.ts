import { erc20sData, zeroAddress } from "@defi.org/web3-candies";

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
    name: "Binance Smart Chain",
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
  43114: {
    id: 43114,
    name: "Avalanche",
    shortname: "avax",
    native: {
      address: zeroAddress,
      symbol: "AVAX",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/avalanche.svg",
    },
    wToken: erc20sData.avax.WAVAX,
    publicRpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/avalanche.svg",
    explorer: "https://snowtrace.io",
    eip1559: true,
  },
  10: {
    id: 10,
    name: "Optimism",
    shortname: "oeth",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    },
    wToken: erc20sData.oeth.WETH,
    publicRpcUrl: "https://mainnet.optimism.io",
    logoUrl: "https://app.1inch.io/assets/images/network-logos/optimism.svg",
    explorer: "https://optimistic.etherscan.io",
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
  1284: {
    id: 1284,
    name: "Moonbeam",
    shortname: "glmr",
    native: {
      address: zeroAddress,
      symbol: "GLMR",
      decimals: 18,
      logoUrl: "https://moonscan.io/images/svg/brands/mainbrand-1.svg",
    },
    wToken: erc20sData.glmr.WGLMR,
    publicRpcUrl: "https://rpc.api.moonbeam.network",
    logoUrl: "https://moonscan.io/images/svg/brands/mainbrand-1.svg",
    explorer: "https://moonscan.io",
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
    logoUrl: "https://lineascan.build/images/logo.svg",
    explorer: "https://lineascan.build",
    eip1559: false,
  },
  324: {
    id: 324,
    name: "zksync",
    shortname: "zksync",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    },
    wToken: erc20sData.zksync.WETH,
    publicRpcUrl: "https://mainnet.era.zksync.io",
    logoUrl: "https://raw.githubusercontent.com/matter-labs/zksync/0a4ca2145a0c95b5bafa84c2f095c644907a8825/zkSyncLogo.svg",
    explorer: "https://explorer.zksync.io/",
    eip1559: true,
  },
  1101: {
    id: 1101,
    name: "zkevm",
    shortname: "zkevm",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://app.1inch.io/assets/images/network-logos/ethereum.svg",
    },
    wToken: erc20sData.zkevm.WETH,
    publicRpcUrl: "https://zkevm-rpc.com",
    logoUrl: "https://user-images.githubusercontent.com/18598517/235932702-bc47eae5-d672-4dd9-9da2-8ea8f51a93f3.png",
    explorer: "https://zkevm.polygonscan.com/",
    eip1559: true,
  },
  169: {
    id: 169,
    name: "manta",
    shortname: "manta",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://icons.llamao.fi/icons/chains/rsz_manta.jpg",
    },
    wToken: erc20sData.manta.WETH,
    publicRpcUrl: "https://pacific-rpc.manta.network/http",
    logoUrl: "https://icons.llamao.fi/icons/chains/rsz_manta.jpg",
    explorer: "https://manta.socialscan.io/",
    eip1559: true,
  },
  81457: {
    id: 81457,
    name: "blast",
    shortname: "blast",
    native: {
      address: zeroAddress,
      symbol: "ETH",
      decimals: 18,
      logoUrl: "https://icons.llamao.fi/icons/chains/rsz_blast",
    },
    wToken: erc20sData.blast.WETH,
    publicRpcUrl: "https://rpc.ankr.com/blast",
    logoUrl: "https://icons.llamao.fi/icons/chains/rsz_blast",
    explorer: "https://blastscan.io/",
    eip1559: true,
  },
};