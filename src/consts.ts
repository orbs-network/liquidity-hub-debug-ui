export const MOBILE = 768;
export const MAX_LAYOUT_WIDTH = 1350;

export const colors = {
  dark: {
    link: "#0171d9",
    bgMain:'#0B0D16',
    cardBg: "#14161F",
    textMain: "#ededed",
    textSecondary: "rgba(255, 255, 255, 0.6)",
    inputBg:'#15273A',
    bgTooltip:'black',
  },
};


export enum URL_QUERY_KEYS  {
  USER = "user",
  ORDER_ID = "order_id",
  TX_HASH = "tx_hash",
  TWAP_ADDRESS = "twap_address",
  IN_TOKEN = "in_token",
  OUT_TOKEN = "out_token",
  CHAIN_ID = "chain_id",
  MIN_DOLLAR_VALUE = "min_dollar_value",
  PARTNER_ID = "partner_id",
  ORDER_STATUS = "order_status",
  FEE_OUT_AMOUNT_USD = "fee_out_amount_usd",
  TIMESTAMP = "timestamp",
  ORDER_TYPE = "order_type",
  SESSION_ID = "session_id",
}


export const FILTER_KEY_NAMES = {
  [URL_QUERY_KEYS.TIMESTAMP]: "Timestamp",
  [URL_QUERY_KEYS.ORDER_ID]: "Order ID",
  [URL_QUERY_KEYS.TX_HASH]: "Tx Hash",
  [URL_QUERY_KEYS.USER]: "User",
  [URL_QUERY_KEYS.CHAIN_ID]: "Chain ID",
  [URL_QUERY_KEYS.TWAP_ADDRESS]: "Twap Address",
  [URL_QUERY_KEYS.IN_TOKEN]: "In Token",
  [URL_QUERY_KEYS.OUT_TOKEN]: "Out Token",
  [URL_QUERY_KEYS.FEE_OUT_AMOUNT_USD]: "Fee Out Amount USD",
  [URL_QUERY_KEYS.ORDER_STATUS]: "Order Status",
  [URL_QUERY_KEYS.MIN_DOLLAR_VALUE]: "Min Dollar Value",
  [URL_QUERY_KEYS.PARTNER_ID]: "Partner",
  [URL_QUERY_KEYS.ORDER_TYPE]: "Order Type",
  [URL_QUERY_KEYS.SESSION_ID]: "Session ID",
}


export const REACT_QUERY_KEYS = {
  twapPaginatedOrders: "twapPaginatedOrders",
  twapOrder: "twapOrder",
  twapOrders: "twapOrders",
  configs: "configs",
}