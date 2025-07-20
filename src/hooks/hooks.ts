import { getNetworkByChainId } from "@/utils";
import { useMemo } from "react";

export const useNetwork = (chainId?: number) => {
  return useMemo(() => {
    const config = getNetworkByChainId(chainId);
    return config;
  }, [chainId]);
};
