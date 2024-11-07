import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useAppParams } from "./hooks";
import { getChainConfig } from "./helpers";
import { clob } from "applications";
import { priceUsdService } from "services/price-usd";
import { isNativeAddress } from "@defi.org/web3-candies";
export const queryKey = {
  allSessions: "allSessions",
  tokens: "tokens-logo",
  txDetails: "txDetails",
  usdPrice1Token: "usdPrice1Token",
  getSessionsByFilter: "getSessionsByFilter",
  session: "session",
  tokenAmountUsd: "tokenAmountUsd",
  tokenDetails: "tokenDetails",
};

export const useSwapsQuery = (walletAddress?: string) => {
  const {
    query: { chainId },
  } = useAppParams();

  return useInfiniteQuery({
    queryKey: [queryKey.allSessions, chainId],
    queryFn: ({ signal, pageParam }) => {
      return clob.fetchSwaps({
        page: pageParam,
        chainId: chainId ?? undefined,
        signal,
        walletAddress,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length : undefined; // Return next page number or undefined if no more pages
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage ? undefined : 0; // Modify based on how you paginate backwards
    },
    refetchInterval: 10000,
  });
};



export const useUSDPriceQuery = (address?: string, chainId?: number) => {

  return useQuery({
    queryFn: async () => {
      if (!chainId || !address) return 0;

      if (isNativeAddress(address)) {
        const wToken = getChainConfig(chainId)?.wToken.address;
        if (!wToken) return 0;
        return priceUsdService.getPrice(wToken, chainId);
      }

      return priceUsdService.getPrice(address, chainId);
    },
    queryKey: [queryKey.usdPrice1Token, chainId, address],
    staleTime: Infinity,
  });
};
