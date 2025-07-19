import { useMemo } from "react";
import { getConfigByExchange, getPartnerByTwapExchange } from "@/utils";
import { useConfigs } from "@/lib/queries/use-configs";
import { Partner } from "@/types";

export const useTwapConfigByExchange = (
  exchange?: string,
  chainId?: number
) => {
  const {data: configs} = useConfigs();

  return useMemo(() => {
    if (!exchange || !chainId) return;
    return getConfigByExchange(configs || [], exchange, chainId);
  }, [exchange, chainId, configs]);
};

export const usePartnerConfigs = (partner?: Partner) => {
  const {data: configs} = useConfigs();
  return useMemo(() => {
    return configs?.filter((config) => config.partner === partner?.twapId);
  }, [configs, partner]);
};

export const useTwapPartnerByExchange = (
  exchange?: string,
  chainId?: number
) => {
  const {data: configs} = useConfigs();
  return useMemo(() => {
    if (!exchange || !chainId) return;
    return getPartnerByTwapExchange(configs || [], exchange, chainId);
  }, [exchange, chainId, configs]);
};
