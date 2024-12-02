import _ from "lodash";


export const LIQUIDITY_HUB_ROUTER_PATHS = {
  tx: 'tx',
  user: 'user',
  transactions: 'transactions',
}

export const TWAP_ROUTER_PATHS = {
  order: 'order',
  orders: 'orders',
  maker: 'maker',
}

export const ROUTES = {
  root: "/",
  liquidityHub: {
    root: "/liquidity-hub",
    transactions: `/liquidity-hub/${LIQUIDITY_HUB_ROUTER_PATHS.transactions}`,
    tx: `/liquidity-hub/${LIQUIDITY_HUB_ROUTER_PATHS.tx}/:sessionIdOrTxHash`,
    user: `/liquidity-hub/${LIQUIDITY_HUB_ROUTER_PATHS.user}/:user`,
  },
  twap: {
    root: `/twap`,
    orders: `/twap/${TWAP_ROUTER_PATHS.orders}`,
    maker: `/twap/${TWAP_ROUTER_PATHS.maker}/:maker`,
    order: `/twap/${TWAP_ROUTER_PATHS.order}/:orderId`,
  },
};

export const ELASTIC_ENDPOINT = "https://api.bi.orbs.network";
export const TWAP_ELASTIC_CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-twap-ui*`;
export const LIQUIDITY_HUB_ELASTIC_SERVER_URL = `${ELASTIC_ENDPOINT}/orbs-clob-poc10.*`;
export const LIQUIDITY_HUB_ELASTIC_CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-liquidity-hub-ui*`;

export const DEFAULT_SESSIONS_TIME_RANGE = "30m";

export const TX_TRACE_SERVER = "https://lh-tools.orbs.network/tx-trace";
