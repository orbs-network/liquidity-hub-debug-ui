import { useUSDPriceQuery } from "query";
import { useCallback, useMemo } from "react";
import { useNumericFormat } from "react-number-format";
import { StringParam, useQueryParams, NumberParam } from "use-query-params";
import { DEFAULT_SESSIONS_TIME_RANGE } from "./config";
import {
  amountUiV2,
  getChainConfig,
  getRpcUrl,
  getTokenDetails,
} from "./helpers";
import BN from "bignumber.js";
import Web3 from "web3";
import { notification } from "antd";

import {
  eqIgnoreCase,
  isNativeAddress,
  zeroAddress,
} from "@defi.org/web3-candies";

export const useAppParams = () => {
  const [query, setQuery] = useQueryParams(
    {
      timeRange: StringParam,
      sessionType: StringParam,
      chainId: NumberParam,
      partner: StringParam,
    },
    {
      updateType: "pushIn",
    }
  );

  return {
    query: {
      timeRange: query.timeRange || DEFAULT_SESSIONS_TIME_RANGE,
      sessionType: query.sessionType,
      chainId: query.chainId as number | undefined,
      partner: query.partner as string | undefined,
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

function formatAmount(amount?: number | string | null) {
  if (!amount) return "0";
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (numericAmount >= 1_000_000_000_000_000) {
    return (
      (numericAmount / 1_000_000_000_000_000).toFixed(2).replace(/\.00$/, "") +
      "Q"
    );
  } else if (numericAmount >= 1_000_000_000_000) {
    return (
      (numericAmount / 1_000_000_000_000).toFixed(2).replace(/\.00$/, "") + "T"
    );
  } else if (numericAmount >= 1_000_000_000) {
    return (
      (numericAmount / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B"
    );
  } else if (numericAmount >= 1_000_000) {
    return (numericAmount / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  } else if (numericAmount >= 1_000) {
    return (numericAmount / 1_000).toFixed(2).replace(/\.00$/, "") + "K";
  }

  return undefined;
}

export const useNumberFormatter = ({
  value,
  decimalScale = 3,
  format,
}: {
  value?: string | number;
  decimalScale?: number;
  format?: boolean;
}) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const adjustedDecimalScale =
  numericValue && Math.abs(numericValue) < 1
    ? Math.min(decimalScale + Math.ceil(Math.abs(Math.log10(Math.abs(numericValue)))), 20) // Cap to 20 decimals for practical purposes
    : decimalScale;
  const result = useNumericFormat({
    value,
    decimalScale: adjustedDecimalScale,
    thousandSeparator: ",",
  }).value;
  const formattedAmount = formatAmount(value);
  return format && formattedAmount ? formattedAmount : result;
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

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Partner, partners } from "partners";
import _ from "lodash";
import { getPartnerWithExchangeAddress } from "utils";
import { MOBILE } from "consts";
import { Configs } from "@orbs-network/twap-sdk";
import { useLocation, useNavigate } from "react-router";

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

export const useToken = (tokenAddress?: string, chainId?: number) => {
  const w3 = useWeb3(chainId);
  const chainConfig = useChainConfig(chainId);

  return useQuery({
    queryKey: ["useGetToken", tokenAddress, chainId],
    queryFn: async () => {
      if (isNativeAddress(tokenAddress!)) {
        return {
          address: tokenAddress!,
          name: chainConfig?.native.symbol,
          symbol: chainConfig?.native?.symbol,
          decimals: chainConfig?.native?.decimals,
        };
      }
      return getTokenDetails(tokenAddress!, w3!, chainId!);
    },
    enabled: !!tokenAddress && !!chainId && !!w3,
    staleTime: Infinity,
  }).data;
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

export const usePartnerFromName = (name?: string): Partner | undefined => {
  return useMemo(() => {
    return partners[name?.toLowerCase() as keyof typeof partners];
  }, [name]);
};

export const useLiquidityHubPartner = (dex?: string) => {
  return useMemo(() => {
    if (!dex) return;
    return partners[dex.toLowerCase() as keyof typeof partners];
  }, [dex]);
};

export const useTwapPartner = (exchangeAddress?: string) => {
  return useMemo(() => {
    if (!exchangeAddress) return;
    return getPartnerWithExchangeAddress(exchangeAddress);
  }, [exchangeAddress]);
};

export const usePartnerByName = (name?: string) => {
  return useMemo(() => {
    if (!name) return;
    return Object.values(partners).find(
      (partner) => partner.name.toLowerCase() === name.toLowerCase()
    );
  }, [name]);
};

export const useTwapConfigByExchange = (exchangeAddress?: string) => {
  return useMemo(() => {
    if (!exchangeAddress) return;
    return Object.values(Configs).find((config) =>
      eqIgnoreCase(config.exchangeAddress, exchangeAddress)
    );
  }, [exchangeAddress]);
};

export const useNavigateWithParams = () => {
  const search = useLocation().search;
  const navigate = useNavigate();

  return useCallback(
    (route: string) => {
      navigate(`${route}${search}`);
    },
    [navigate, search]
  );
};
