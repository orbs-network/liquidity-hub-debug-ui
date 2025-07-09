import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/consts";
import { useAppParams } from "@/hooks";
import { api } from "@/lib/api";
import { getConfigByTwapAddress } from "@/utils";

export const useTwapOrdersQuery = () => {
  const {
    query: { user, chainId, partner, orderId, orderTxHash },
  } = useAppParams();
  return useInfiniteQuery({
    queryKey: [
      REACT_QUERY_KEYS.twapOrders,
      chainId,
      partner,
      user,
      orderId,
      orderTxHash,
    ],
    queryFn: async ({ signal, pageParam = 0 }) => {
      
      const orders = await api.twap.getOrders({
        signal,
        page: pageParam,
        limit: 200,
        chainId,
        partner,
        user,
        orderId: orderId ? Number(orderId) : undefined,
        orderTxHash,
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
    staleTime: Infinity,
  });
};


export const useTwapOrderQuery = () => {
  const {
    query: { chainId, orderId, twapAddress },
  } = useAppParams();


  return useQuery({
    queryKey: [REACT_QUERY_KEYS.twapOrder, chainId, orderId, twapAddress],
    queryFn: async ({ signal }) => {
      const config = getConfigByTwapAddress(twapAddress!, chainId!);
      if (!config) {
        throw new Error("Config not found");
      }
      const order = await api.twap.getOrder(Number(orderId), config, signal);
      return order;
    },
    enabled: !!chainId && !!orderId && !!twapAddress,
  });
};