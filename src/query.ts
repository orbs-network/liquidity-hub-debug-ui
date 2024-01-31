import { eqIgnoreCase } from "@defi.org/web3-candies";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Web3 from "web3";
import { api } from "./api/api";
import { REACTOR_ADDRESS } from "./config";
import { useEthers, useWeb3 } from "./hooks";
import { Session, SessionsFilter } from "./types";
import BN from "bignumber.js";
import {
  convertScientificStringToDecimal,
  getContract,
  getERC20Transfers,
} from "./helpers";
export const queryKey = {
  allSessions: "allSessions",
  tokens: "tokens-logo",
  txDetails: "txDetails",
  usdPrice1Token: "usdPrice1Token",
  getSessionsByFilter: "getSessionsByFilter",
  session: "session",
};

export const usegetSessionsQuery = (
  filter?: SessionsFilter,
  timeRange?: string
) => {
  return useQuery({
    queryKey: [queryKey.allSessions, timeRange, filter],
    queryFn: ({ signal }) => {
      return api.getSessions({
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
      const receipt = await web3?.eth.getTransactionReceipt(session?.txHash!);
      
      const logs = receipt?.logs;
      console.log(receipt);
      
      if (!logs) return null;
     logs.forEach((log) => {
        console.log(log);
         
     });
      
      return {
        logs: await getERC20Transfers(web3!, logs, session?.chainId!),
        gasUsed: Web3.utils.fromWei(receipt?.effectiveGasPrice || 0, "gwei"),
        gasUsedMatic: Web3.utils.fromWei(receipt?.effectiveGasPrice || 0, "ether"),
        blockNumber: receipt?.blockNumber.toString(),
        txStatus: receipt?.status.toString(),
      };
    },
    staleTime: Infinity,
    enabled: !!session?.txHash && !!web3 && !!session?.chainId,
  });
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
