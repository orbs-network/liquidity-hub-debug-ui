import { networks } from "@/networks";
import {
  getOrders as getOrdersSdk,
  Order,
  GetOrdersFilters,
  eqIgnoreCase,
} from "@orbs-network/twap-sdk";
import _ from "lodash";

const getOrders = async ({
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
   

    const chains = chainIds.length ? chainIds : Object.values(networks).map((network) => network.id)

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

const getOrder = async (
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

export const twapApi = {
  getOrders,
  getOrder,
};
