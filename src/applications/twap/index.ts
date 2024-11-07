import { getAllOrders } from "@orbs-network/twap-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";



export const useTwapOrders = (chainId?: number | null, exchangeAddress?: string) => {
  return useInfiniteQuery({
    queryKey: ["useTwapOrders", chainId, exchangeAddress],
    queryFn: ({ signal, pageParam = 0 }) => {
      return getAllOrders({
        signal,
        page: pageParam,
        limit: 200,
        chainId: chainId!,
        exchangeAddress,
      });
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
