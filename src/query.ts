import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Web3 from "web3";
import { useWeb3 } from "./hooks";
import { SessionsFilter } from "./types";
import BN from "bignumber.js";
import {
  convertScientificStringToDecimal,
  getERC20Transfers,
} from "./helpers";
import { clob } from "applications";
import { priceUsdService } from "services/price-usd";
export const queryKey = {
  allSessions: "allSessions",
  tokens: "tokens-logo",
  txDetails: "txDetails",
  usdPrice1Token: "usdPrice1Token",
  getSessionsByFilter: "getSessionsByFilter",
  session: "session",
};

export const usegetClobSessionsQuery = (
  filter?: SessionsFilter,
  timeRange?: string
) => {
  return useQuery({
    queryKey: [queryKey.allSessions, timeRange, filter],
    queryFn: ({ signal }) => {
      return clob.getSessions({
        signal,
        timeRange,
        filter,
      });
    },
    staleTime: Infinity,
  });
};

export const useTxDetailsQuery = ({
  chainId,
  txHash,
}: {
  chainId?: number;
  txHash?: string;
}) => {
  const web3 = useWeb3(chainId);
  return useQuery({
    queryKey: [queryKey.txDetails, txHash],
    queryFn: async () => {
      const receipt = await web3?.eth.getTransactionReceipt(txHash!);
      
      const logs = receipt?.logs;
      console.log(receipt);
      
      if (!logs) return null;
     logs.forEach((log) => {
        console.log(log);
         
     });
      
      return {
        logs: await getERC20Transfers(web3!, logs, chainId!),
        gasUsed: Web3.utils.fromWei(receipt?.effectiveGasPrice || 0, "gwei"),
        gasUsedMatic: Web3.utils.fromWei(receipt?.effectiveGasPrice || 0, "ether"),
        blockNumber: receipt?.blockNumber.toString(),
        txStatus: receipt?.status.toString(),
      };
    },
    staleTime: Infinity,
    enabled: !!txHash && !!web3 && !!chainId,
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

      return priceUsdService.getPrice(address, chainId);
    },
    queryKey: [queryKey.usdPrice1Token, chainId, address],
    refetchInterval: 10_000,
    staleTime: Infinity,
  });
};
