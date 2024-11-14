import { OrderType } from "@orbs-network/twap-sdk";

export const parseOrderType = (orderType?: string) => {
  switch (orderType) {
    case OrderType.LIMIT:
      return "Limit";
    case OrderType.TWAP_LIMIT:
      return "TWAP Limit";
    case OrderType.TWAP_MARKET:
      return "Twap Market";

    default:
      break;
  }
};
