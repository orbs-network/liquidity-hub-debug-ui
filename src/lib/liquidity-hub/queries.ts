/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidTxHash, parseTimestampFromQuery } from "../utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  LIQUIDITY_HUB_ELASTIC_CLIENT_URL,
  LIQUIDITY_HUB_ELASTIC_SERVER_URL,
  TX_TRACE_SERVER,
} from "@/config";
import { LiquidityHubQuote, LiquidityHubSwap, SwapQueryResponse } from "../liquidity-hub/types";
import axios from "axios";
import { useQueryFilterParams } from "../hooks/use-query-filter-params";
import { fetchElastic } from "../lib";
import { elasticQueries } from "./elastic-queries";
import { useMemo } from "react";
import moment from "moment";
import { PARTNERS } from "@/partners";

export const useLHSwaps = () => {
  const {
    query: {
      chain_id,
      partner_id,
      min_dollar_value,
      in_token,
      out_token,
      fee_out_amount_usd,
      user,
      session_id,
      tx_hash
    },
  } = useQueryFilterParams();

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
      session_id,
      tx_hash
    ],
    queryFn: async ({ signal, pageParam }) => {
      const data = elasticQueries.getSwaps({
        page: pageParam,
        chainId: chain_id,
        limit: 100,
        walletAddress: user,
        dex: partner_id,
        minDollarValue: min_dollar_value,
        inToken: in_token,
        outToken: out_token,
        feeOutAmountUsd: fee_out_amount_usd,
        sessionId: session_id,
        txHash: tx_hash,
      });

      return fetchElastic<LiquidityHubSwap>(
        LIQUIDITY_HUB_ELASTIC_SERVER_URL,
        data,
        signal
      );
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

export const useLHSwap = (identifier?: string) => {
  return useQuery<SwapQueryResponse>({
    queryKey: ["useLiquidityHubSession", identifier],
    queryFn: async ({ signal }) => {
      if (!identifier) {
        throw new Error("Invalid transaction hash or session id");
      }
      let query;
      if (isValidTxHash(identifier)) {
        query = elasticQueries.getSwapByTxHash(identifier);
      } else {
        query = elasticQueries.getSwapById(identifier);
      }

      const response = await fetchElastic<LiquidityHubSwap>(
        LIQUIDITY_HUB_ELASTIC_SERVER_URL,
        query,
        signal
      );

      const swap = response[0];
      const { sessionId } = swap;

      const [quotes, clientLogs] = [
        await fetchElastic<LiquidityHubQuote>(
          LIQUIDITY_HUB_ELASTIC_SERVER_URL,
          elasticQueries.getSwapQuotesById(sessionId),
          signal
        ),
        await fetchElastic<any>(
          LIQUIDITY_HUB_ELASTIC_CLIENT_URL,
          elasticQueries.getClientBySessionId(sessionId),
          signal
        ),
      ];
      return {
        swap,
        quotes: quotes || [],
        clientLogs: clientLogs || [],
        quote: quotes[quotes.length - 1] as LiquidityHubQuote | undefined,
      };
    },
    enabled: !!identifier,
  });
};

export const useLHLogTrace = (swap?: LiquidityHubSwap) => {
  return useQuery({
    queryKey: ["useLogTrace", swap?.sessionId],
    queryFn: async ({ signal }) => {
      if (!swap) {
        throw new Error("Swap is required");
      }
      const result = swap.txHash
        ? await axios.post(
            TX_TRACE_SERVER + "/run",
            {
              chainId: swap.chainId,
              txHash: swap.txHash,
            },
            {
              signal,
            }
          )
        : await axios.post(
            TX_TRACE_SERVER + "/call",
            {
              chainId: swap.chainId,
              blockNumber: swap.blockNumber,
              txData: swap.dexRouteData,
            },
            {
              signal,
            }
          );
      return result.data;
    },
    enabled: !!swap,
  });
};

export const useLHTotalSwapsVolume = () => {
  const {
    query: { timestamp },
  } = useQueryFilterParams();

  const { from: startDate, to: endDate } = useMemo(
    () => parseTimestampFromQuery(timestamp),
    [timestamp]
  );

  return useQuery({
    queryKey: ["useLHTotalSwapsVolume", startDate, endDate],
    queryFn: async ({ signal }) => {
      const data = elasticQueries.getTotalSwapsVolume(startDate, endDate);
      const response = await axios.post(
        `${LIQUIDITY_HUB_ELASTIC_SERVER_URL}/_search`,
        { ...data },
        { signal }
      );

      return response.data.aggregations["0"].value;
    },
  });
};

export const useLHTotalFees = () => {
  const {
    query: { timestamp },
  } = useQueryFilterParams();

  const { from: startDate, to: endDate } = useMemo(
    () => parseTimestampFromQuery(timestamp),
    [timestamp]
  );

  return useQuery({
    queryKey: ["useLHTotalFees", startDate, endDate],
    queryFn: async ({ signal }) => {
      const data = elasticQueries.getTotalFees(startDate, endDate);
      const response = await axios.post(
        `${LIQUIDITY_HUB_ELASTIC_SERVER_URL}/_search`,
        { ...data },
        { signal }
      );
      return response.data.aggregations["0"].value;
    },
  });
};

export const useLHTotalSwaps = () => {
  const {
    query: { timestamp },
  } = useQueryFilterParams();

  const { from: startDate, to: endDate } = useMemo(
    () => parseTimestampFromQuery(timestamp),
    [timestamp]
  );

  return useQuery({
    queryKey: ["useLHTotalSwaps", startDate, endDate],
    queryFn: async ({ signal }) => {
      const data = elasticQueries.getTotalSwap(startDate, endDate);
      const response = await axios.post(
        `${LIQUIDITY_HUB_ELASTIC_SERVER_URL}/_search`,
        { ...data },
        { signal }
      );

      return response.data.hits.total.value;
    },
  });
};

export const useLHTotalUniqueSwappers = () => {
  const {
    query: { timestamp },
  } = useQueryFilterParams();

  const { from: startDate, to: endDate } = useMemo(
    () => parseTimestampFromQuery(timestamp),
    [timestamp]
  );

  return useQuery({
    queryKey: ["useLHTotalUniqueSwappers", startDate, endDate],
    queryFn: async ({ signal }) => {
      const data = elasticQueries.getUniqueSwappers(startDate, endDate);
      const response = await axios.post(
        `${LIQUIDITY_HUB_ELASTIC_SERVER_URL}/_search`,
        { ...data },
        { signal }
      );

      return response.data.aggregations["0"].value;
    },
  });
};

export const useLHDexVolume = () => {
  const {
    query: { timestamp },
  } = useQueryFilterParams();

  const { from: startDate, to: endDate } = useMemo(
    () => parseTimestampFromQuery(timestamp),
    [timestamp]
  );

  return useQuery({
    queryKey: ["useLHDexVolume", startDate, endDate],
    queryFn: async ({ signal }) => {
      const getVolume = async (partnerId: string, chainId: number) => {
        const data = elasticQueries.getDexVolume(partnerId, chainId, startDate, endDate);
        const response = await axios.post(
          `${LIQUIDITY_HUB_ELASTIC_SERVER_URL}/_search`,
          { ...data },
          { signal }
        );
        return {
          partnerId,
          chainId,
          value: response.data.aggregations["0"].value as number,
        };
      };

      const result = await Promise.all(PARTNERS.map((partner) => {
        return partner.liquidityHubChains.map((chainId) => {
          return getVolume(partner.liquidityHubID, chainId);
        });
      }).flat());

      return result.sort((a, b) => b.value - a.value);
    },
  });
};

export const useLHDexFees = () => {
  const {
    query: { timestamp },
  } = useQueryFilterParams();

  const { from: startDate, to: endDate } = useMemo(
    () => parseTimestampFromQuery(timestamp),
    [timestamp]
  );

  return useQuery({
    queryKey: ["useLHDexFees", startDate, endDate, timestamp],
    queryFn: async ({ signal }) => {
      const getFees = async (partnerId: string, chainId: number) => {
        const data = elasticQueries.getDexFees(
          partnerId,
          chainId,
          startDate,
          endDate || moment().valueOf()
        );
        const response = await axios.post(
          `${LIQUIDITY_HUB_ELASTIC_SERVER_URL}/_search`,
          { ...data },
          { signal }
        );
        return {
          partnerId,
          chainId,
          value: response.data.aggregations["0"].value as number,
        };
      };


      const calls = PARTNERS.map((partner) => {
        return partner.liquidityHubChains.map((chainId) => {
          return getFees(partner.liquidityHubID, chainId);
        });
      }).flat();

      const result = await Promise.all(calls);
      return result.sort((a, b) => b.value - a.value);
      
    },
    staleTime: Infinity,
  });
};
