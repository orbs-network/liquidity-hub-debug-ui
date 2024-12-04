import { getOrders, getOrderById, getOrderByTxHash } from "@orbs-network/twap-sdk";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queries } from "applications/elastic";
import { TWAP_ELASTIC_CLIENT_URL } from "config";
import { fetchElastic } from "helpers";
import { usePartnerByName } from "hooks";
import _ from "lodash";
import { useMemo } from "react";
import { isValidTxHash } from "utils";

export const useTwapOrders = (
  chainId?: number | null,
  partnerName?: string,
  maker?: string
) => {
  const partner = usePartnerByName(partnerName);
  const exchangeAddress = useMemo(
    () => partner?.getTwapConfigByChainId(chainId as number)?.exchangeAddress,
    [chainId, partner]
  );
  return useInfiniteQuery({
    queryKey: ["useTwapOrders", chainId, exchangeAddress, maker],
    queryFn: async ({ signal, pageParam = 0 }) => {
      const orders = await getOrders({
        signal,
        page: pageParam,
        limit: 200,
        chainId: chainId!,
        exchangeAddress,
        account: maker
      });
      return orders;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length : undefined; // Return next page number or undefined if no more pages
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage ? undefined : 0; // Modify based on how you paginate backwards
    },
    refetchInterval: 30_000,
    enabled: !!chainId,
  });
};

export const useTwapOrder = (chainIdOrTxHash?: string, chainId?: number) => {
  return useQuery({
    queryKey: ["useTwapOrder", chainId, chainIdOrTxHash],
    queryFn: async ({ signal }) => {
      if(isValidTxHash(chainIdOrTxHash!)) {
        return getOrderByTxHash({
          signal,
          chainId: chainId!,
          txHash: chainIdOrTxHash!,
        });
      }
      return getOrderById({
        signal,
        chainId: chainId!,
        id: Number(chainIdOrTxHash)!,
      });
      
    },
    enabled: !!chainId && !!chainIdOrTxHash,
  });
};

export const useTwapClientLogs = (orderId?: number, chainId?: number) => {
  return useQuery({
    queryKey: ["useTwapClientLogs", orderId, chainId],
    queryFn: async ({ signal }) => {
      const query = queries.twapLogs(orderId!, chainId!);
      const result = await fetchElastic(TWAP_ELASTIC_CLIENT_URL, query, signal);

      return result;
    },
    enabled: !!orderId && !!chainId,
  });
};
