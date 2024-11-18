import _ from "lodash";
import { fetchElastic } from "helpers";
import { queries } from "../elastic";
import { isValidSessionId, isValidTxHash } from "utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAppParams } from "hooks";
import {
  LIQUIDITY_HUB_ELASTIC_CLIENT_URL,
  LIQUIDITY_HUB_ELASTIC_SERVER_URL,
} from "config";
import { LiquidityHubSession, LiquidityHubSwap } from "./interface";

export const useLiquidityHubSwaps = (walletAddress?: string) => {
  const {
    query: { chainId, partner },
  } = useAppParams();

  return useInfiniteQuery({
    queryKey: ["useLiquidityHubSwaps", chainId, walletAddress, partner],
    queryFn: async ({ signal, pageParam }) => {
      const data = queries.swaps({
        page: pageParam,
        chainId,
        limit: 100,
        walletAddress,
        dex: partner?.toLowerCase(),
      });

      const logs = await fetchElastic(
        LIQUIDITY_HUB_ELASTIC_SERVER_URL,
        data,
        signal
      );
      
      return logs.map((log) => {
        return new LiquidityHubSwap(log);
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

export const useLiquidityHubSession = () => {
  const txHashOrSessionId = useParams().identifier;

  return useQuery({
    queryKey: ["useLiquidityHubSession", txHashOrSessionId],
    queryFn: async ({ signal }) => {
      if (!txHashOrSessionId) {
        throw new Error("Invalid transaction hash or session id");
      }
      let query;

      if (isValidTxHash(txHashOrSessionId)) {
        query = queries.transactionHash(txHashOrSessionId);
      } else if (isValidSessionId(txHashOrSessionId)) {
        query = queries.sessionId(txHashOrSessionId);
      } else {
        throw new Error("Invalid transaction hash or session id");
      }

      const swapLogs = await fetchElastic(
        LIQUIDITY_HUB_ELASTIC_SERVER_URL,
        query,
        signal
      );

      const [swapLog] = swapLogs;
      const { sessionId } = swapLog;

      const [quoteLogs, clientLogs] = [
        await fetchElastic(
          LIQUIDITY_HUB_ELASTIC_SERVER_URL,
          queries.quote(sessionId),
          signal
        ),
        await fetchElastic(
          LIQUIDITY_HUB_ELASTIC_CLIENT_URL,
          queries.client(sessionId),
          signal
        ),
      ];
      return new LiquidityHubSession(swapLog, quoteLogs, clientLogs);
    },
    staleTime: Infinity,
    enabled: !!txHashOrSessionId,
  });
};
