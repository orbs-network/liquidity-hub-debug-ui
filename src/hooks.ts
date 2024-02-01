import { useUSDPrice } from "query";
import { useMemo } from "react";
import { useNumericFormat } from "react-number-format";
import { StringParam, useQueryParams, NumberParam } from "use-query-params";
import { DEFAULT_SESSIONS_TIME_RANGE } from "./config";
import { getWeb3 } from "./helpers";
import BN from "bignumber.js";
export const useAppParams = () => {
  const [query, setQuery] = useQueryParams(
    {
      timeRange: StringParam,
      sessionType: StringParam,
      chainId: NumberParam,
    },
    {
      updateType: "pushIn",
    }
  );

  return {
    query: {
      timeRange: query.timeRange || DEFAULT_SESSIONS_TIME_RANGE,
      sessionType: query.sessionType,
      chainId: query.chainId,
    },
    setQuery,
  };
};

export const useWeb3 = (chainId?: number) => {
  return useMemo(() => getWeb3(chainId), [chainId]);
};

export const useNumberFormatter = ({
  value,
  decimalScale = 4,
  dynamicDecimals = true,
}: {
  value?: string | number;
  decimalScale?: number;
  dynamicDecimals?: boolean;
}) => {
  const decimals = useMemo(() => {
    if (!value) return 0;
    const [, decimal] = value.toString().split(".");
    if (!decimal) return 0;
    const arr = decimal.split("");
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "0") {
        count++;
      } else {
        break;
      }
    }

    return !count ? decimalScale : count + decimalScale;
  }, [value, decimalScale]);

  return useNumericFormat({
    value,
    decimalScale: dynamicDecimals ? decimals : decimalScale,
    thousandSeparator: ",",
  }).value;
};

export const useTokenAmountUsd = (
  tokenAddress?: string,
  amount?: string | number,
  chainId?: number
) => {
    
  const { data: price } = useUSDPrice(tokenAddress, chainId);


  return useMemo(() => {
    if (!amount || !price) return "";
    return BN(amount).multipliedBy(price).toString();
  }, [price, tokenAddress, amount]);
};
