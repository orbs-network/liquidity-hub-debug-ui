import {
  getAllOrders,
  getOrderById,
} from "@orbs-network/twap-sdk";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queries } from "applications/elastic";
import { TWAP_ELASTIC_CLIENT_URL } from "config";
import { fetchElastic } from "helpers";
import { usePartnerByName } from "hooks";
import _ from "lodash";
import { useMemo } from "react";

export const useTwapOrders = (
  chainId?: number | null,
  partnerName?: string
) => {
  const partner = usePartnerByName(partnerName);
  const exchangeAddress = useMemo(
    () => partner?.getTwapConfigByChainId(chainId as number)?.exchangeAddress,
    [chainId, partner]
  );
  return useInfiniteQuery({
    queryKey: ["useTwapOrders", chainId, exchangeAddress],
    queryFn: async ({ signal, pageParam = 0 }) => {
      const orders = await getAllOrders({
        signal,
        page: pageParam,
        limit: 200,
        chainId: chainId!,
        exchangeAddress,
      });      
      return orders
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

export const useTwapOrder = (chainId?: number, orderId?: string) => {
  return useQuery({
    queryKey: ["useTwapOrder", chainId, orderId],
    queryFn: async ({ signal }) => {
      const order = await getOrderById({
        signal,
        chainId: chainId!,
        orderId: Number(orderId)!,
      });
  
      return order
    },
    enabled: !!chainId && !!orderId,
  });
};


export const useTwapClientLogs = (orderId?: number, chainId?:  number) => {

    return useQuery({
        queryKey: ["useTwapClientLogs", orderId, chainId],
        queryFn: async ({ signal }) => {
            const query = queries.twapLogs(orderId!, chainId!)
            const result =      await fetchElastic(TWAP_ELASTIC_CLIENT_URL, query, signal)
            console.log({result});
        
            return result

        },
        enabled: !!orderId && !!chainId,
    })
}