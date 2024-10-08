import { network } from "@defi.org/web3-candies";

export const ROUTES = {
  main: "/",
  public: "/tx/:identifier",
  clobSessions: "/clob",
  clobSessionsByAddress: "/clob/address/:address",
  clobSession: "/clob/session/:identifier",

  navigate: {
    clobSession: (sessionId: string) => `/clob/session/${sessionId}`,
    clobUserAddressSessions: (address: string) => `/clob/address/${address}`,
    tx: (address: string) => `/tx/${address}`,
  },
};

export const DEFAULT_SESSIONS_TIME_RANGE = "30m";
export const POLYGONSCAN_API_KEY = "EW51KER6DBZQNE33P34IAX1V9UY4DZR1Z3";
export const POLYGONSCAN_API_ENDPOINT = "https://api.polygonscan.com/api";
export const RPC_API_KEY = "7ef8e170641c4d459e296af0336ccec4";
export const POLYGON_INFURA_RPC = `https://polygon-mainnet.infura.io/v3/${RPC_API_KEY}`;
export const BSC_RPC = "https://bsc.publicnode.com";
export const REACTOR_ADDRESS = "0x21Da9737764527e75C17F1AB26Cb668b66dEE0a0";
export const TX_TRACE_SERVER = "https://lh-tools.orbs.network"


export const CHAIN_CONFIG = {
  137: {
    native: network(137).native,
    wToken: network(137).wToken,
  },
  56: {
    native: network(56).native,
    wToken: network(56).wToken,
  },
};


export const GAS_ADDRESS = "0x7ae466596C57241459eBaE32D2E64F51Da68F3B8";
export const FEES_ADDRESS = "0xbd098dB9AD3dbaF2bDAF581340B2662d9A3CA8D2";