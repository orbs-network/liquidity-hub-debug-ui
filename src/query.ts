import { eqIgnoreCase, erc20abi } from "@defi.org/web3-candies";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Web3 from "web3";
import { api } from "./api/api";
import { DEFAULT_SESSIONS_TIME_RANGE, REACTOR_ADDRESS } from "./config";
import { useAppParams, useWeb3 } from "./hooks";
import { Session, SessionType } from "./types";
import BN from "bignumber.js";
const queryKey = {
  allSessions: "allSessions",
  session: "session",
  tokens: "tokens-logo",
  txDetails: "txDetails",
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

export const useGetAllSessionsQuery = () => {
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
        chainId: query.chainId as number | undefined,
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

      return handleLogs(web3!, logs);
    },
    staleTime: Infinity,
    enabled: !!session?.txHash && !!web3,
  });
};

const handleLogs = async (web3: Web3, logs: any[]) => {
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
        const payTokenContract = createContarct(web3, log.address);
        let decimals;
        let symbol;
        try {
          decimals = (await payTokenContract.methods.decimals().call()) as any;
          symbol = (await payTokenContract.methods.symbol().call()) as any;
        } catch (error) {
          return undefined;
        }

        if (!decimals) return;
        const tokenAmount = amountUi(
          Number(web3.utils.fromWei(decimals, "wei")),
          new BN(web3.utils.fromWei(parsed.amount as string, "wei"))
        );

        const [fullNum,  _decimals] = tokenAmount.split(".");
        if (
          _.size(_decimals) > 18 ||
           Number(fullNum) > 18 ||
          eqIgnoreCase(REACTOR_ADDRESS, parsed.fromAddress as string) ||
          eqIgnoreCase(REACTOR_ADDRESS, parsed.toAddress as string)
        ) {
          return undefined;
        }
        return {
          tokenAmount,
          fromAddress: parsed.fromAddress as string,
          toAddress: parsed.toAddress as string,
          tokenAddress: log.address as string,
          tokenSymbol: symbol as string,
        };
      }
    })
  );

  return _.compact(res);
};
export const amountUi = (decimals?: number, amount?: BN) => {
  if (!decimals || !amount) return "";
  const percision = new BN(10).pow(decimals || 0);
  return convertScientificStringToDecimal(
    amount.times(percision).idiv(percision).div(percision).toString(),
    decimals
  );
};

function convertScientificStringToDecimal(
  scientificString: string,
  decimals: number
) {
  // Check if the input string is in scientific notation
  if (/e/i.test(scientificString)) {
    // Convert scientific notation string to decimal string
    let decimalString = parseFloat(scientificString).toFixed(decimals);
    return decimalString;
  } else {
    // If not in scientific notation, return the original string
    return scientificString;
  }
}

const createContarct = (web3: Web3, address: any) => {
  return new web3.eth.Contract(erc20abi as any, address);
};
