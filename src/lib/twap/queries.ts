import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/consts";
import { useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import moment from "moment";
import { useQueryFilterParams } from "../hooks/use-query-filter-params";
import { networks } from "@/networks";
import {
  getOrders as getOrdersSdk,
  GetOrdersFilters,
  eqIgnoreCase,
  Order,
  getPartnerIdentifier,
  LEGACY_EXCHANGES_MAP,
} from "@orbs-network/twap-sdk";
import _ from "lodash";
import { parseTimestampFromQuery } from "../utils";
import { getPartnersById } from "../utils";
import { TwapConfig } from "./types";
import axios from "axios";

const fetchOrders = async ({
  chainIds,
  signal,
  page,
  limit = 200,
  filters,
}: {
  chainIds: number[];
  signal?: AbortSignal;
  page?: number;
  limit?: number;
  filters: GetOrdersFilters;
}): Promise<Order[]> => {
  try {
    const chains = chainIds.length
      ? chainIds
      : Object.values(networks).map((network) => network.id);

    const results = await Promise.allSettled(
      chains.map((chain) => {
        return getOrdersSdk({
          chainId: chain,
          filters,
          signal,
          page,
          limit,
        });
      })
    );

    const res = results.map((result) =>
      result.status === "fulfilled" ? result.value : null
    );

    const orders = _.flatten(res)
      .filter(Boolean)
      .sort((a, b) => b!.createdAt - a!.createdAt) as Order[];

    return orders;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchOrder = async (
  orderId: number,
  chainId: number,
  twapAddress: string,
  signal?: AbortSignal
) => {
  const results = await getOrdersSdk({
    signal,
    chainId,
    filters: { orderIds: [orderId] },
  });

  return results.find((order) => eqIgnoreCase(order.twapAddress, twapAddress));
};

const useOrdersQueryKey = (key: string) => {
  const { query } = useQueryFilterParams();
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
  const { query } = useQueryFilterParams();
  const { data: allConfigs } = useTwapConfigs();

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

      const orders = await fetchOrders({
        signal,
        page,
        limit,
        chainIds: query.chain_id
          ? query.chain_id.map(Number)
          : configs.map((config) => config.chainId),
        filters: {
          accounts: query.user,
          orderIds: query.order_id ? query.order_id.map(Number) : undefined,
          transactionHashes: query.tx_hash ? query.tx_hash : undefined,
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
  const { data: configs, isLoading: configsLoading } = useTwapConfigs();

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
    enabled: !!configs,
  });

  return {
    ...query,
    isLoading: query.isLoading || configsLoading,
  };
};

export const useTwapOrders = () => {
  const queryKey = useOrdersQueryKey(REACT_QUERY_KEYS.twapOrders);
  const { mutateAsync: getOrders } = useGetOrdersMutation();
  const { data: configs, isLoading: configsLoading } = useTwapConfigs();

  const query = useQuery({
    queryKey: queryKey,
    queryFn: async ({ signal }) => {
      return getOrders({
        signal,
      });
    },
    enabled: !!configs,
  });

  return {
    ...query,
    isLoading: query.isLoading || configsLoading,
  };
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
  } = useQueryFilterParams();

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
      const order = await fetchOrder(
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




export const useTwapConfigs = () => {
  return useQuery<TwapConfig[]>({
    queryKey: [REACT_QUERY_KEYS.configs],
    queryFn: async ({ signal }) => {
      const response = await axios.get(
        "https://raw.githubusercontent.com/orbs-network/twap/master/configs.json",
        {
          signal,
        }
      );
      const configs = response.data;

      return _.map(configs, (config) => {
        const key = getPartnerIdentifier(config)
        const legacyExchanges = LEGACY_EXCHANGES_MAP[key]
        return {
          ...config,
          exchangeAddresses: legacyExchanges ? [...legacyExchanges, config.exchangeAddress] : [config.exchangeAddress],
        legacyExchanges: legacyExchanges || []
        };
      });
    },
    staleTime: Infinity,
  });
};