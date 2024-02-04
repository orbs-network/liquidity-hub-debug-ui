import { network } from "@defi.org/web3-candies";

export const ROUTES = {
  main: "/",
  clobSessions: "/clob",
  clobSessionsByAddress: "/clob/address/:address",
  clobSession: "/clob/session/:identifier",

  navigate: {
    clobSession: (sessionId: string) => `/clob/session/${sessionId}`,
    clobUserAddressSessions: (address: string) => `/clob/address/${address}`,
  },
};

export const DEFAULT_SESSIONS_TIME_RANGE = "30m";
export const POLYGONSCAN_API_KEY = "EW51KER6DBZQNE33P34IAX1V9UY4DZR1Z3";
export const POLYGONSCAN_API_ENDPOINT = "https://api.polygonscan.com/api";
export const RPC_API_KEY = "7ef8e170641c4d459e296af0336ccec4";
export const POLYGON_INFURA_RPC = `https://polygon-mainnet.infura.io/v3/${RPC_API_KEY}`;
export const BSC_RPC = "https://bsc.publicnode.com";
export const REACTOR_ADDRESS = "0x21Da9737764527e75C17F1AB26Cb668b66dEE0a0";

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
