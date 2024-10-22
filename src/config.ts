import Thena from 'assets/dex/thena.png'
import Lynex from 'assets/dex/lynex.png'
import Quickswap from 'assets/dex/quickswap.svg'
import Spookyswap from 'assets/dex/spooky.png'
import Blast from 'assets/dex/blast.png'
import Intentx from 'assets/dex/intentx.png'



export const ROUTES = {
  main: "/",
  tx: "/tx/:identifier",
  address: "/user/:address",

  navigate: {
    tx: (address: string) => `/tx/${address}`,
    address: (address: string) => `/user/${address}`,
    main: () => "/",
  },
};
export const ELASTIC_ENDPOINT = "https://api.bi.orbs.network";

export const DEFAULT_SESSIONS_TIME_RANGE = "30m";
export const RPC_API_KEY = "7f79fe8f32bc4c29848c1f49a0b7fbb7";
export const POLYGON_INFURA_RPC = `https://polygon-mainnet.infura.io/v3/${RPC_API_KEY}`;
export const BSC_RPC = "https://bsc.publicnode.com";
export const REACTOR_ADDRESS = "0x21Da9737764527e75C17F1AB26Cb668b66dEE0a0";

export const TX_TRACE_SERVER = "https://lh-tools.orbs.network/tx-trace";

export const GAS_ADDRESS = "0x7ae466596C57241459eBaE32D2E64F51Da68F3B8";
export const FEES_ADDRESS = "0xbd098dB9AD3dbaF2bDAF581340B2662d9A3CA8D2";

export const dexConfig = {
  quickswap: {
    chainId: 137,
    website: "https://quickswap.exchange/",
    logoUrl: Quickswap,
    name:'Quickswap'
  },
  spookyswap: {
    chainId: 250,
    website: "https://spooky.fi/",
    logoUrl: Spookyswap,
    name:'Spookyswap'
  },
  lynex: {
    chainId: 59144,
    website: "https://www.lynex.fi/",
    logoUrl: Lynex,
    name:'Lynex'
  },
  thena: {
    chainId: 56,
    website: "https://thena.fi/",
    logoUrl: Thena,
    name:'Thena'
  },
  intentx: {
    chainId: 8453,
    website: "https://intentx.io/",
    logoUrl: Intentx,
    name:'Intentx'
  },
  fenix: {
    chainId: 81457,
    website: "https://blast.io/en",
    logoUrl: Blast,
    name:'Blast'
  },
};
