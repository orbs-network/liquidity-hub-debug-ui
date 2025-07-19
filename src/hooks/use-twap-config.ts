import { useConfigs } from "@/lib/queries/use-configs";
import { Config } from "@/types";
import { useMemo } from "react";

export const useTwapConfig = (partner?: string) => {
  const { data: configs } = useConfigs();
  return useMemo((): Config[] => {
    if (!configs) return [];
    return configs.filter((config) => config.partner === partner);
  }, [configs, partner]);
};
