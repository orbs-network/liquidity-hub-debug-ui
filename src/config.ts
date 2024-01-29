
export const ROUTES = {
  main: "/",
  session: "/session/:sessionId",
  navigate: {
    session: (sessionId: string) => `/session/${sessionId}`,
  },
};


export const DEFAULT_SESSIONS_TIME_RANGE = "30m";
export const POLYGONSCAN_API_KEY = "EW51KER6DBZQNE33P34IAX1V9UY4DZR1Z3";
export const POLYGONSCAN_API_ENDPOINT = "https://api.polygonscan.com/api";
export const POLYGON_INFURA_RPC = "https://polygon-mainnet.infura.io/v3/7ef8e170641c4d459e296af0336ccec4";
export const BSC_RPC = "https://bsc.publicnode.com";
export const REACTOR_ADDRESS = "0x21Da9737764527e75C17F1AB26Cb668b66dEE0a0";