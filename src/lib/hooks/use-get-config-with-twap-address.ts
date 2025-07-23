import { getConfigByTwapAddress } from "../twap/utils";
import { useMemo } from "react";

export const useConfigByTwapAddress = (
    twapAddress?: string,
    chainId?: number
  ) => {
    return useMemo(
      () =>
        twapAddress && chainId
          ? getConfigByTwapAddress(twapAddress, chainId)
          : undefined,
      [twapAddress, chainId]
    );
  };
  