import { getNetwork } from "@orbs-network/twap-sdk";
import { useMemo } from "react";

export const useNetwork = (chainId?: number) => {
  return useMemo(() => {
    const config = getNetwork(chainId);
    return config;
  }, [chainId]);
};
