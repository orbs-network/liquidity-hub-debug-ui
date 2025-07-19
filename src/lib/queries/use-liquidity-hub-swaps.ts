import { fetchElastic } from "@/helpers";
import { isValidTxHash } from "@/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAppParams } from "@/hooks";
import {
  LIQUIDITY_HUB_ELASTIC_CLIENT_URL,
  LIQUIDITY_HUB_ELASTIC_SERVER_URL,
} from "@/config";
import { queries } from "@/applications/elastic";
import { LiquidityHubSession, LiquidityHubSwap } from "@/applications/clob/interface";


export const useLiquidityHubSwaps = () => {
  const {
    query: {
      chain_id,
      partner_id,
      min_dollar_value,
      in_token,
      out_token,
      fee_out_amount_usd,
      user,
    },
  } = useAppParams();

  return useInfiniteQuery({
    queryKey: [
      "useLiquidityHubSwaps",
      chain_id,
      user,
      partner_id,
      min_dollar_value,
      in_token,
      out_token,
      fee_out_amount_usd,
    ],
    queryFn: async ({ signal, pageParam }) => {
      // const fromTimestamp = moment().subtract(4, "day").valueOf();
      // const toTimestamp = moment().subtract(2, "day").valueOf();
      // const limit = fromTimestamp && toTimestamp ? 1000 : 100;
      const data = queries.swaps({
        page: pageParam,
        chainId: chain_id,
        limit: 100,
        walletAddress: user,
        dex: partner_id,
        minDollarValue: min_dollar_value,
        inToken: in_token,
        outToken: out_token,
        feeOutAmountUsd: fee_out_amount_usd,
        // fromDate: fromTimestamp,
        // toDate: toTimestamp,
      });

      let logs = [];

      logs = await fetchElastic(LIQUIDITY_HUB_ELASTIC_SERVER_URL, data, signal);

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
  const sessionIdOrTxHash = useParams().sessionIdOrTxHash;

  return useQuery({
    queryKey: ["useLiquidityHubSession", sessionIdOrTxHash],
    queryFn: async ({ signal }) => {
      if (!sessionIdOrTxHash) {
        throw new Error("Invalid transaction hash or session id");
      }
      let query;
      if (isValidTxHash(sessionIdOrTxHash)) {
        query = queries.transactionHash(sessionIdOrTxHash);
      } else {
        query = queries.sessionId(sessionIdOrTxHash);
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
    enabled: !!sessionIdOrTxHash,
  });
};
