import {
  Config,
  getOrders as getOrdersSdk,
  Order,
} from "@orbs-network/twap-sdk";
import _ from "lodash";
import { networks } from "@/networks";

const getOrders = async ({
  chainId,
  config,
  signal,
  page,
  limit = 200,
  partner,
  user,
  orderId,
  orderTxHash,
}: {
  chainId?: number;
  config?: Config;
  signal?: AbortSignal;
  page?: number;
  limit?: number;
  partner?: string;
  user?: string;
  orderId?: number;
  orderTxHash?: string;
}): Promise<Order[]> => {
  const filters = {
    account: user,
    orderId: orderId ? Number(orderId) : undefined,
    txHash: orderTxHash,
  };
  try {
    if (chainId) {
      const results = await getOrdersSdk({
        signal,
        chainId,
        filters: { config, ...filters },
        page,
        limit,
      });

      return results.sort((a, b) => b.createdAt - a.createdAt);
    }

    const results = await Promise.allSettled(
      Object.values(networks).map((network) => {
        return getOrdersSdk({
          chainId: network.id,
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
    return _.flatten(res)
      .filter(Boolean)
      .sort((a, b) => b!.createdAt - a!.createdAt) as Order[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getOrder = async (
  orderId: number,
  config: Config,
  signal?: AbortSignal
) => {
  const results = await getOrdersSdk({
    signal,
    chainId: config.chainId,
    filters: { config, orderId },
  });

  return results[0];
};

export const twapApi = {
  getOrders,
  getOrder
};
