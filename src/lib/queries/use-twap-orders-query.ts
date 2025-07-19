import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/consts";
import { useAppParams } from "@/hooks";
import { api } from "@/lib/api";
import { getPartnersById, parseTimestampFromQuery } from "@/utils";
import { useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { Order } from "@orbs-network/twap-sdk";
import moment from "moment";
import { useConfigs } from "./use-configs";

const useOrdersQueryKey = (key: string) => {
  const { query } = useAppParams();
  return useMemo(
    () => [
      key,
      query.chain_id,
      query.partner_id,
      query.user,
      query.order_id,
      query.tx_hash,
      query.in_token,
      query.out_token,
      query.min_dollar_value,
      query.timestamp,
      query.order_type,
    ],
    [query, key]
  );
};

const useGetOrdersMutation = () => {
  const { query } = useAppParams();
  const { data: allConfigs } = useConfigs();

  return useMutation({
    mutationFn: async ({
      signal,
      page,
      limit,
    }: {
      signal?: AbortSignal;
      page?: number;
      limit?: number;
    }) => {
      const { from, to } = parseTimestampFromQuery(query.timestamp);
      const partners = getPartnersById(query.partner_id);
      if (!allConfigs) {
        throw new Error("No configs found");
      }

      const configs = allConfigs.filter((config) =>
        partners?.some((partner) => partner.twapId === config.partner)
      );

      const orders = await api.twap.getOrders({
        signal,
        page,
        limit,
        chainIds: query.chain_id
          ? query.chain_id.map(Number)
          : configs.map((config) => config.chainId),
        filters: {
          accounts: query.user,
          orderIds: query.order_id ? query.order_id.map(Number) : undefined,
          transactionHashes: query.tx_hash ? [query.tx_hash] : undefined,
          inTokenSymbols: query.in_token ? query.in_token.flat() : undefined,
          outTokenSymbols: query.out_token ? query.out_token.flat() : undefined,
          minDollarValueIn: query.min_dollar_value
            ? Number(query.min_dollar_value)
            : undefined,
          configs: configs,
          startDate: from ? moment(from).unix() : undefined,
          endDate: to ? moment(to).unix() : undefined,
          orderType: query.order_type as "limit" | "market" | undefined,
        },
      });

      return orders;
    },
  });
};

const usePaginatedTwapOrdersQuery = () => {
  const queryKey = useOrdersQueryKey(REACT_QUERY_KEYS.twapPaginatedOrders);
  const { mutateAsync: getOrders } = useGetOrdersMutation();
  const { data: configs } = useConfigs();

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ signal, pageParam = 0 }) => {
      return getOrders({
        signal,
        page: pageParam,
        limit: 500,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length : undefined; // Return next page number or undefined if no more pages
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage ? undefined : 0; // Modify based on how you paginate backwards
    },
    refetchInterval: 60_000,
    staleTime: Infinity,
    enabled: !!configs,
  });

  return query;
};

export const useTwapOrders = () => {
  const queryKey = useOrdersQueryKey(REACT_QUERY_KEYS.twapOrders);
  const { mutateAsync: getOrders } = useGetOrdersMutation();
  const { data: configs } = useConfigs();

  return useQuery({
    queryKey: queryKey,
    queryFn: async ({ signal }) => {
      return getOrders({
        signal,
      });
    },
    enabled: !!configs,
  });
};

const filterOrders = (
  orders: Order[],
  filters: {
    order_status?: string[];
  }
) => {
  if (filters.order_status) {
    return orders.filter((order) => {
      return filters.order_status?.includes(order.status.toLowerCase());
    });
  }
  return orders;
};

export const usePaginatedTwapOrders = () => {
  const query = usePaginatedTwapOrdersQuery();
  const {
    query: { order_status },
  } = useAppParams();

  const fetchNextPage = useCallback(() => {
    if (!query.isFetchingNextPage || !query.hasNextPage) return;
    query.fetchNextPage();
  }, [query]);

  return useMemo(() => {
    return {
      orders: filterOrders(query.data?.pages.flat() || [], {
        order_status,
      }),
      isLoading: query.isLoading,
      isFetchingNextPage: query.isFetchingNextPage,
      fetchNextPage,
    };
  }, [
    query.data?.pages,
    query.isLoading,
    query.isFetchingNextPage,
    order_status,
    fetchNextPage,
  ]);
};

export const useTwapOrderQuery = () => {
  const { orderId, twapAddress, chainId } = useParams();

  return useQuery({
    queryKey: [REACT_QUERY_KEYS.twapOrder, chainId, orderId, twapAddress],
    queryFn: async ({ signal }) => {
      const order = await api.twap.getOrder(
        Number(orderId),
        Number(chainId),
        twapAddress!,
        signal
      );

      return order;
    },
    enabled: !!chainId && !!orderId && !!twapAddress,
  });
};
