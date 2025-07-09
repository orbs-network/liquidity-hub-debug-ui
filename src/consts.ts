export const MOBILE = 768;
export const MAX_LAYOUT_WIDTH = 1350;
export const IS_ADMIN = localStorage.getItem("adminKey") === "orbs_2025";

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


export const URL_QUERY_KEYS = {
  USER: "user",
  ORDER_ID: "order_id",
  TWAP_ORDER_TX_HASH: "twap_order_tx_hash",
  TWAP_ADDRESS: "twap_address",
}


export const REACT_QUERY_KEYS = {
  twapOrders: "twapOrders",
  twapOrder: "twapOrder",
}