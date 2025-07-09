import { getConfigByExchange } from "@orbs-network/twap-sdk";
import { useMemo } from "react";
import { getPartnerByTwapExchange } from "@/utils";

export const useTwapConfigByExchange = (
  exchange?: string,
  chainId?: number
) => {
  return useMemo(() => {
    if (!exchange || !chainId) return;
    return getConfigByExchange(exchange, chainId);
  }, [exchange, chainId]);
};

export const useTwapPartnerByExchange = (
  exchange?: string,
  chainId?: number
) => {
  return useMemo(() => {
    if (!exchange || !chainId) return;
    return getPartnerByTwapExchange(exchange, chainId);
  }, [exchange, chainId]);
};
