/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from "react";
import { useNumericFormat } from "react-number-format";
import {
  StringParam,
  useQueryParams,
  ArrayParam,
} from "use-query-params";
import { getChain, toAmountUI } from "./helpers";
import BN from "bignumber.js";
import { notification } from "antd";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getConfigByTwapAddress,
  getMinDecimalScaleForLeadingZero,
  getPartnersById,
} from "@/utils";
import { MOBILE, URL_QUERY_KEYS } from "@/consts";
import { useLocation, useNavigate } from "react-router";
import { priceUsdService } from "@/services/price-usd";
import {
  getNetwork,
  isNativeAddress,
  zeroAddress,
} from "@orbs-network/twap-sdk";
import { erc20Abi } from "viem";
import { getPublicClient } from "@/lib";

export const useToken = (
  tokenAddress?: string,
  chainId?: number,
  disabled = false
) => {
  return useQuery({
    queryKey: ["useToken", tokenAddress, chainId],
    queryFn: async () => {
      const publicClient = getPublicClient(chainId!);
      const chain = getChain(chainId);

      if (isNativeAddress(tokenAddress!)) {
        return {
          address: tokenAddress!,
          name: chain?.nativeCurrency.symbol as string,
          symbol: chain?.nativeCurrency.symbol as string,
          decimals: chain?.nativeCurrency.decimals as number,
        };
      }
      if (!publicClient) {
        throw new Error("Public client not found");
      }
      const [name, symbol, decimals] = await publicClient.multicall({
        contracts: [
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "name",
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "symbol",
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals",
          },
        ],
        allowFailure: false, // or true if you want individual calls to continue on failure
      });
      return {
        address: tokenAddress!,
        name: name as string,
        symbol: symbol as string,
        decimals: decimals as number,
      };
    },
    enabled: !!tokenAddress && !!chainId && !disabled,
    staleTime: Infinity,
  });
};

export const useAppParams = () => {
  const [query, setQuery] = useQueryParams(
    {
      timeRange: StringParam,
      sessionType: StringParam,
      [URL_QUERY_KEYS.FEE_OUT_AMOUNT_USD]: StringParam,
      [URL_QUERY_KEYS.USER]: ArrayParam,
      [URL_QUERY_KEYS.TX_HASH]: StringParam,
      [URL_QUERY_KEYS.ORDER_ID]: ArrayParam,
      [URL_QUERY_KEYS.TWAP_ADDRESS]: StringParam,
      [URL_QUERY_KEYS.IN_TOKEN]: ArrayParam,
      [URL_QUERY_KEYS.OUT_TOKEN]: ArrayParam,
      [URL_QUERY_KEYS.PARTNER_ID]: ArrayParam,
      [URL_QUERY_KEYS.CHAIN_ID]: ArrayParam,
      [URL_QUERY_KEYS.MIN_DOLLAR_VALUE]: StringParam,
      [URL_QUERY_KEYS.ORDER_STATUS]: ArrayParam,
      [URL_QUERY_KEYS.TIMESTAMP]: StringParam,
      [URL_QUERY_KEYS.ORDER_TYPE]: StringParam,
    },
    {
      updateType: "pushIn",
    }
  );

  return useMemo(() => {
   return  {
      query: {
        sessionType: query.sessionType,
        [URL_QUERY_KEYS.MIN_DOLLAR_VALUE]: query[URL_QUERY_KEYS.MIN_DOLLAR_VALUE] as
          | string
          | undefined,
        [URL_QUERY_KEYS.FEE_OUT_AMOUNT_USD]: query[URL_QUERY_KEYS.FEE_OUT_AMOUNT_USD] as string | undefined,
        [URL_QUERY_KEYS.USER]: query[URL_QUERY_KEYS.USER] as string[] | undefined,
        [URL_QUERY_KEYS.TX_HASH]: query[URL_QUERY_KEYS.TX_HASH] as string | undefined,
        [URL_QUERY_KEYS.ORDER_ID]: query[URL_QUERY_KEYS.ORDER_ID] as string[] | undefined,
        [URL_QUERY_KEYS.TWAP_ADDRESS]: query[URL_QUERY_KEYS.TWAP_ADDRESS] as string | undefined,
        [URL_QUERY_KEYS.IN_TOKEN]: query[URL_QUERY_KEYS.IN_TOKEN] as string[] | undefined,
        [URL_QUERY_KEYS.OUT_TOKEN]: query[URL_QUERY_KEYS.OUT_TOKEN] as string[] | undefined,
        [URL_QUERY_KEYS.CHAIN_ID]: query[URL_QUERY_KEYS.CHAIN_ID] as string[] | undefined,
        [URL_QUERY_KEYS.PARTNER_ID]: query[URL_QUERY_KEYS.PARTNER_ID] as string[] | undefined,
        [URL_QUERY_KEYS.ORDER_STATUS]: query[URL_QUERY_KEYS.ORDER_STATUS] as string[] | undefined,
        [URL_QUERY_KEYS.TIMESTAMP]: query[URL_QUERY_KEYS.TIMESTAMP] as string | undefined,
        [URL_QUERY_KEYS.ORDER_TYPE]: query[URL_QUERY_KEYS.ORDER_TYPE] as string | undefined,
      },
      setQuery: {
        updateQuery: (value:any) =>
          setQuery(value),
        resetQuery: () => {
          Object.values(URL_QUERY_KEYS).forEach((key) => {
            setQuery({ [key]: undefined });
          });
        },
      },
    };
  }, [query, setQuery])
};

function shortenNumber(amount?: number | string | null, decimalScale = 2) {
  if (!amount) return "0";
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (numericAmount >= 1_000_000_000_000_000) {
    return (
      (numericAmount / 1_000_000_000_000_000)
        .toFixed(decimalScale)
        .replace(/\.00$/, "") + "Q"
    );
  } else if (numericAmount >= 1_000_000_000_000) {
    return (
      (numericAmount / 1_000_000_000_000)
        .toFixed(decimalScale)
        .replace(/\.00$/, "") + "T"
    );
  } else if (numericAmount >= 1_000_000_000) {
    return (
      (numericAmount / 1_000_000_000)
        .toFixed(decimalScale)
        .replace(/\.00$/, "") + "B"
    );
  } else if (numericAmount >= 1_000_000) {
    return (
      (numericAmount / 1_000_000).toFixed(decimalScale).replace(/\.00$/, "") +
      "M"
    );
  } else if (numericAmount >= 1_000) {
    return (
      (numericAmount / 1_000).toFixed(decimalScale).replace(/\.00$/, "") + "K"
    );
  }

  return undefined;
}

export const useTokenValueFormatter = ({
  value,
  tokenDecimals,
  decimalScale,
}: {
  value?: string | number;
  tokenDecimals?: number;
  decimalScale?: number;
}) => {
  return useNumberFormatter({
    value,
    decimalScale:
      decimalScale || tokenDecimals === 8
        ? 2
        : tokenDecimals === 18
        ? 4
        : undefined,
  });
};

export const useNumberFormatter = ({
  value,
  decimalScale = 2,
}: {
  value?: string | number;
  decimalScale?: number;
}) => {
  const decimals = useMemo(() => {
    const res = getMinDecimalScaleForLeadingZero(value);
    return !res ? decimalScale : res > 5 ? 0 : decimalScale;
  }, [value, decimalScale]);

  const formatted = useNumericFormat({
    value,
    decimalScale: decimals,
    thousandSeparator: ",",
  }).value;

  const short = useMemo(() => {
    return shortenNumber(value, 2);
  }, [value]);

  return {
    formatted,
    short: short || formatted,
  };
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

  const { data: price } = useUSDPrice(tokenAddress, chainId);

  return useMemo(() => {
    if (!amount || !price) return "";
    return BN(amount).multipliedBy(price).toString();
  }, [price, amount]);
};

export const useExplorerUrl = (chainId?: number) => {
  return useMemo(() => {
    return getChain(chainId)?.blockExplorers?.default?.url || "";
  }, [chainId]);
};

type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): CopyFn {
  const [api] = notification.useNotification();

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      api.open({
        message: "Copied to clipboard",
        duration: 4000,
      });
      return true;
    } catch (error) {
      console.warn("Copy failed", error);

      return false;
    }
  };

  return copy;
}

export const useHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export const useAmountUI = (
  decimals?: number,
  value?: string | BN | number
) => {
  return useMemo(
    () => toAmountUI(value?.toString() || "", decimals || 0),
    [decimals, value]
  );
};

export const useNavigateWithParams = () => {
  const search = useLocation().search;
  const navigate = useNavigate();

  return useCallback(
    (
      route: string,
      params?: Record<string, string | number | (string | number)[] | undefined>
    ) => {
      const query = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => query.append(key, v.toString()));
          } else {
            query.set(key, value?.toString() || "");
          }
        });
      }

      const queryString = query.toString();
      const finalUrl = `${route}${queryString ? `?${queryString}` : search}`;

      navigate(finalUrl, { replace: true });
    },
    [navigate, search]
  );
};

export const useUSDPrice = (address?: string, chainId?: number) => {
  return useQuery({
    queryFn: async () => {
      if (!chainId || !address) return 0;

      if (isNativeAddress(address)) {
        const wToken = getNetwork(chainId)?.wToken.address;
        if (!wToken) return 0;
        return priceUsdService.getPrice(wToken, chainId);
      }

      return priceUsdService.getPrice(address, chainId);
    },
    queryKey: ["usdPrice1Token", chainId, address],
    staleTime: Infinity,
  });
};
export function useDebounce(value?: string, delay = 5_00) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useAppType = () => {
  const location = useLocation();

  return useMemo(() => {
    if (location.pathname.includes("liquidity-hub")) {
      return "lh";
    }
    if (location.pathname.includes("twap")) {
      return "twap";
    }
  }, [location.pathname]);
};

export const usePartnerWithIds = (ids?: string[]) => {
  return useMemo(() => (ids ? getPartnersById(ids) : undefined), [ids]);
};

export const usePartnerWithId = (id?: string) => {
  return useMemo(() => (id ? getPartnersById([id])?.[0] : undefined), [id]);
};

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
