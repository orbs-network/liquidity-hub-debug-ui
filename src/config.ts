import _ from "lodash";

export const ROUTES = {
  main: "/",
  transactions: "/transactions",
  tx: "/address/:identifier",
  address: "/user/:address",
  twap: {
    root: "/twap",
    order: "/twap/order/:orderId",
  },

  navigate: {
    tx: (address: string) => `/address/${address}`,
    address: (address: string) => `/user/${address}`,
    main: () => "/",
    transactions: () => ROUTES.transactions,
    twap: {
      order: (orderId: number) => {
        return `${ROUTES.twap.root}/order/${orderId}`;
      },
    },
  },
};
export const ELASTIC_ENDPOINT = "https://api.bi.orbs.network";
export const TWAP_ELASTIC_CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-twap-ui*`;
export const LIQUIDITY_HUB_ELASTIC_SERVER_URL = `${ELASTIC_ENDPOINT}/orbs-clob-poc10.*`;
export const LIQUIDITY_HUB_ELASTIC_CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-liquidity-hub-ui*`;

export const DEFAULT_SESSIONS_TIME_RANGE = "30m";

export const TX_TRACE_SERVER = "https://lh-tools.orbs.network/tx-trace";
