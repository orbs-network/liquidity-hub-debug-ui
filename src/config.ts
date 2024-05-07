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
export const RPC_API_KEY = "7f79fe8f32bc4c29848c1f49a0b7fbb7";
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
  250: {
    native: network(250).native,
    wToken: network(250).wToken,
  }
};

export const GAS_ADDRESS = "0x7ae466596C57241459eBaE32D2E64F51Da68F3B8";
export const FEES_ADDRESS = "0xbd098dB9AD3dbaF2bDAF581340B2662d9A3CA8D2";

