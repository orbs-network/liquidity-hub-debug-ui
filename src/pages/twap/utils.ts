import { OrderType } from "@orbs-network/twap-sdk";

export const parseOrderType = (orderType?: OrderType) => {
  switch (orderType) {
    case OrderType.LIMIT:
    case OrderType.TWAP_LIMIT:
      return "Limit";
    case OrderType.TWAP_MARKET:
      return "Market";

    default:
      break;
  }
};
