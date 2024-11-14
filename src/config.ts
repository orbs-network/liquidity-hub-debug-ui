import _ from "lodash";

export const ROUTES = {
  main: "/",
  transactions: "/transactions",
  tx: "/tx/:identifier",
  address: "/user/:address",
  twap: {
    root: "/twap",
    order: "/twap/order/:orderId",
  },

  navigate: {
    tx: (address: string) => `/tx/${address}`,
    address: (address: string) => `/user/${address}`,
    main: () => "/",
    transactions: () => ROUTES.transactions,
    twap: {
      order: (orderId: number) => {        
        return `${ROUTES.twap.root}/order/${orderId}`
      },
    }
  },
};
export const ELASTIC_ENDPOINT = "https://api.bi.orbs.network";
export const TWAP_ELASTIC_CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-twap-ui*`

export const DEFAULT_SESSIONS_TIME_RANGE = "30m";
export const RPC_API_KEY = "7f79fe8f32bc4c29848c1f49a0b7fbb7";
export const POLYGON_INFURA_RPC = `https://polygon-mainnet.infura.io/v3/${RPC_API_KEY}`;
export const BSC_RPC = "https://bsc.publicnode.com";
export const REACTOR_ADDRESS = "0x21Da9737764527e75C17F1AB26Cb668b66dEE0a0";

export const TX_TRACE_SERVER = "https://lh-tools.orbs.network/tx-trace";

export const GAS_ADDRESS = "0x7ae466596C57241459eBaE32D2E64F51Da68F3B8";
export const FEES_ADDRESS = "0xbd098dB9AD3dbaF2bDAF581340B2662d9A3CA8D2";
