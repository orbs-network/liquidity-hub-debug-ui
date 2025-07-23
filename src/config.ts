
export const LIQUIDITY_HUB_ROUTER_PATHS = {
  swap: 'swap',
  overview: 'overview',
  swapPreview: 'swap-preview',
}

export const TWAP_ROUTER_PATHS = {
  order: 'order',
  orders: 'orders',
  overview: 'overview',
}

export const ROUTES = {
  root: "/",
  liquidityHub: {
    root: "/liquidity-hub",
    swap: `/liquidity-hub/${LIQUIDITY_HUB_ROUTER_PATHS.swap}/:identifier`,
    swapPreview: `/liquidity-hub/${LIQUIDITY_HUB_ROUTER_PATHS.swapPreview}/:identifier`,
    overview: `/liquidity-hub/${LIQUIDITY_HUB_ROUTER_PATHS.overview}`,
  },
  twap: {
    root: `/twap`,
    orders: `/twap/${TWAP_ROUTER_PATHS.orders}`,
    order: `/twap/${TWAP_ROUTER_PATHS.order}/:orderId/:twapAddress/:chainId`,
    overview: `/twap/${TWAP_ROUTER_PATHS.overview}`,
  },
};

export const ELASTIC_ENDPOINT = "https://api.bi.orbs.network";
export const TWAP_ELASTIC_CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-twap-ui*`;
export const LIQUIDITY_HUB_ELASTIC_SERVER_URL = `${ELASTIC_ENDPOINT}/orbs-clob-poc10*`;
export const LIQUIDITY_HUB_ELASTIC_CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-liquidity-hub-ui*`;

export const DEFAULT_SESSIONS_TIME_RANGE = "30m";

export const TX_TRACE_SERVER = "https://utils.orbs.network/tx-trace";
