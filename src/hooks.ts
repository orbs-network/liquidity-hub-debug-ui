import { useUSDPriceQuery } from "query";
import { useMemo } from "react";
import { useNumericFormat } from "react-number-format";
import { StringParam, useQueryParams, NumberParam } from "use-query-params";
import { DEFAULT_SESSIONS_TIME_RANGE, dexConfig } from "./config";
import { amountUiV2, getChainConfig, getRpcUrl } from "./helpers";
import BN from "bignumber.js";
import { useToast } from "@chakra-ui/react";
import Web3 from "web3";

import { zeroAddress } from "@defi.org/web3-candies";

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
  const rpc = getRpcUrl(chainId);
  return useMemo(() => {
    if (!rpc) return;

    return new Web3(new Web3.providers.HttpProvider(rpc));
  }, [chainId]);
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

const wrappedTokenAddress = {
  137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  8453: "0x82af49447d645de28ae773d3d4f76cbe7c52b7df",
  10: "0x4200000000000000000000000000000000000006",
  56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  250: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
  59144: "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
  1: "0x4200000000000000000000000000000000000006",
};

export const useTokenAmountUsd = (
  tokenAddress?: string,
  amount?: string | number,
  chainId?: number
) => {
  chainId = chainId || 137;
  tokenAddress =
    tokenAddress === zeroAddress
      ? wrappedTokenAddress[chainId as keyof typeof wrappedTokenAddress]
      : tokenAddress;

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

import { useState, useEffect } from "react";

export const useResizeObserver = (elementRef: any) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    // Create a ResizeObserver instance to observe element's size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    // Observe the element
    resizeObserver.observe(element);

    // Cleanup observer on unmount
    return () => {
      resizeObserver.unobserve(element);
    };
  }, [elementRef]); // Depend on the elementRef to re-run if the element changes

  return dimensions; // Return the current dimensions (width and height)
};

export const useHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
};

export const useAmountUI = (
  decimals?: number,
  value?: string | BN | number
) => {
  return useMemo(
    () => amountUiV2(decimals, value),
    [decimals, value?.toString()]
  );
};

export const useDexConfig = (dex?: string) => {
  return useMemo(() => {
    if (!dex) return;
    return dexConfig[dex.toLowerCase() as keyof typeof dexConfig];
  }, [dex]);
};
