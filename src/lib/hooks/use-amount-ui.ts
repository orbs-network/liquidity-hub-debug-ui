import BN from "bignumber.js";
import { useMemo } from "react";
import { toAmountUI } from "../utils";

export const useAmountUI = (
  decimals?: number,
  value?: string | BN | number
) => {
  return useMemo(
    () => toAmountUI(value?.toString() || "", decimals || 0),
    [decimals, value]
  );
};
