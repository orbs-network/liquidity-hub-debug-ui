import { useUSDPriceQuery } from "query";
import { useMemo } from "react";
import { useNumericFormat } from "react-number-format";
import { StringParam, useQueryParams, NumberParam } from "use-query-params";
import { DEFAULT_SESSIONS_TIME_RANGE } from "./config";
import { formatNumberDecimals, getChainConfig, getWeb3 } from "./helpers";
import BN from "bignumber.js";
import { useToast } from "@chakra-ui/react";

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
  decimalScale = 2,
  dynamicDecimals = true,
}: {
  value?: string | number;
  decimalScale?: number;
  dynamicDecimals?: boolean;
}) => {
  const decimals = useMemo(() => {
    return formatNumberDecimals(decimalScale, value);
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
  const { data: price } = useUSDPriceQuery(tokenAddress, chainId);

  return useMemo(() => {
    if (!amount || !price) return "";
    return BN(amount).multipliedBy(price).toString();
  }, [price, tokenAddress, amount]);
};

export const useChainConfig = (chainId?: number) => {
  return useMemo(() => {
    return getChainConfig(chainId);
  }, [chainId]);
};

type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): CopyFn {
  const toast = useToast();

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      console.warn("Copy failed", error);

      return false;
    }
  };

  return copy;
}