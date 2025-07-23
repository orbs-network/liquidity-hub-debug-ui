
import { useTwapConfigs } from "@/lib/twap/queries";
import { TwapConfig } from "@/lib/twap/types";
import { useMemo } from "react";

export const useTwapConfig = (partner?: string) => {
  const { data: configs } = useTwapConfigs();
  return useMemo((): TwapConfig[] => {
    if (!configs) return [];
    return configs.filter((config) => config.partner === partner);
  }, [configs, partner]);
};
