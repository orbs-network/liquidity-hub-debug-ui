import { eqIgnoreCase, erc20abi } from "@defi.org/web3-candies";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Web3 from "web3";
import { api } from "./api/api";
import { DEFAULT_SESSIONS_TIME_RANGE, REACTOR_ADDRESS } from "./config";
import { useAppParams, useWeb3 } from "./hooks";
import { Session, SessionsFilter, SessionType } from "./types";
import BN from "bignumber.js";
import { convertScientificStringToDecimal, getContract } from "./helpers";
const queryKey = {
  allSessions: "allSessions",
  session: "session",
  tokens: "tokens-logo",
  txDetails: "txDetails",
  usdPrice1Token: "usdPrice1Token",
  getSessionsByFilter: "getSessionsByFilter",
};

export const useGetSessionByIdQuery = (sessionsId?: string) => {
  return useQuery({
    queryKey: [queryKey.session, sessionsId],
    queryFn: ({ signal }) => {
      return api.getSessionById(sessionsId!, signal);
    },
    enabled: !!sessionsId,
    staleTime: 10_000,
  });
};

export const useGetAllSessionsQuery = (filter?: SessionsFilter) => {
  const { query } = useAppParams();

  const timeRange = query.timeRange || DEFAULT_SESSIONS_TIME_RANGE;

  return useQuery({
    queryKey: [
      queryKey.allSessions,
      query.sessionType,
      timeRange,
      query.chainId,
    ],
    queryFn: ({ signal }) => {
      return api.getAllSessions({
        type: query.sessionType as SessionType,
        signal,
        timeRange,
        filter,
      });
    },
    staleTime: Infinity,
  });
};

export const useTxDetailsQuery = (session?: Session | null) => {
  const web3 = useWeb3(session?.chainId);
  return useQuery({
    queryKey: [queryKey.txDetails, session?.txHash],
    queryFn: async () => {
      const logs = (await web3?.eth.getTransactionReceipt(session?.txHash!))
        ?.logs;
      if (!logs) return null;

      return handleLogs(web3!, logs, session?.chainId!);
    },
    staleTime: Infinity,
    enabled: !!session?.txHash && !!web3 && !!session?.chainId,
  });
};

const handleLogs = async (web3: Web3, logs: any[], chainId: number) => {
  console.log({ logs });

  const res = await Promise.all(
    logs.map(async (log) => {
      let parsed = undefined;

      if (_.size(log.topics) !== 3) return undefined;
      try {
        parsed = web3.eth.abi.decodeLog(
          [
            {
              type: "uint256",
              name: "amount",
            },
            {
              type: "address",
              name: "myNumber",
              indexed: true,
            },
            {
              type: "address",
              name: "fromAddress",
              indexed: true,
            },
            {
              type: "address",
              name: "toAddress",
              indexed: true,
            },
          ],
          log.data as string,
          log.topics as string[]
        );
      } catch (error) {
        return undefined;
      }

      if (parsed && Number(parsed.amount) > 0) {
        const payTokenContract = getContract(web3, log.address);
        let decimals;
        let symbol;
        try {
          decimals = (await payTokenContract.methods.decimals().call()) as any;
          symbol = (await payTokenContract.methods.symbol().call()) as any;
        } catch (error) {
          console;
          return undefined;
        }
        if (!decimals) return;
        const tokenAmount = amountUi(
          Number(web3.utils.fromWei(decimals, "wei")),
          new BN(web3.utils.fromWei(parsed.amount as string, "wei"))
        );

        // const [fullNum,  _decimals] = tokenAmount.split(".");

        if (
          eqIgnoreCase(REACTOR_ADDRESS, parsed.fromAddress as string) ||
          eqIgnoreCase(REACTOR_ADDRESS, parsed.toAddress as string) ||
          eqIgnoreCase(parsed.fromAddress as string, parsed.toAddress as string)
        ) {
          return undefined;
        }

        let priceUsd = "0";

        try {
          priceUsd = await api.getTotalTokensUsdValue({
            address: log.address,
            chainId,
            amount: tokenAmount,
          });
        } catch (error) {
          console.error(error);
        }

        return {
          tokenAmount,
          fromAddress: parsed.fromAddress as string,
          toAddress: parsed.toAddress as string,
          tokenAddress: log.address as string,
          tokenSymbol: symbol as string,
          priceUsd,
        };
      }
    })
  );

  return _.uniqBy(_.compact(res), (v) => [v.fromAddress, v.toAddress].join());
};
export const amountUi = (decimals?: number, amount?: BN) => {
  if (!decimals || !amount) return "";
  const percision = new BN(10).pow(decimals || 0);
  return convertScientificStringToDecimal(
    amount.times(percision).idiv(percision).div(percision).toString(),
    decimals
  );
};



export const useUSDPrice = (address?: string, chainId?: number) => {
  return useQuery({
    queryFn: async () => {
      if (!chainId || !address) return 0;

      return api.fetchPrice(address, chainId);
    },
    queryKey: [queryKey.usdPrice1Token, chainId, address],
    refetchInterval: 10_000,
    staleTime: Infinity,
  });
};

export const useGetSessionsByFilterQuery = (filter?: SessionsFilter) => {
  return useQuery({
    queryKey: [queryKey.session, filter],
    queryFn: ({ signal }) => {
      return api.getSessionsByFilter(filter!, signal);
    },
    enabled: !!filter,
    staleTime: 10_000,
  });
};
