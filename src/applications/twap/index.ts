import {
  getAllOrders,
  getOrderById,
  getOrderFillDelay,
  Order,
} from "@orbs-network/twap-sdk";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { partners } from "partners";
import { getPartnerWithExchangeAddress } from "utils";

export const useTwapOrders = (
  chainId?: number | null,
  exchangeAddress?: string
) => {
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

      return orders.map((o: Order) => {
        const partner = _.find(partners, (it) =>
          it.isExchangeExists(o.exchange)
        );
        const config = partner?.getConfig(o.exchange);
        return {
          ...o,
          fillDelay: config ? getOrderFillDelay(o, config) : 0,
        };
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

export const useTwapOrder = (chainId?: number, orderId?: string) => {
  return useQuery({
    queryKey: ["useTwapOrder", chainId, orderId],
    queryFn: async ({ signal }) => {
      const order = await getOrderById({
        signal,
        chainId: chainId!,
        orderId: Number(orderId)!,
      });
      const config = getPartnerWithExchangeAddress(
        order.exchange
      )?.getExchangeByAddress(order.exchange);

      return {
        ...order,
        fillDelay: !config ? 0 : getOrderFillDelay(order, config),
      };
    },
    enabled: !!chainId && !!orderId,
  });
};
