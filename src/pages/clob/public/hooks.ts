import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  amountUi,
  getContract,
  getWeb3,
  isTxHash,
} from "../../../helpers";
import { queryKey, useTxDetailsQuery } from "../../../query";
import { ClobSession, SessionsFilter } from "../../../types";
import BN from "bignumber.js";
import { clob } from "applications";
import { isNativeAddress } from "@defi.org/web3-candies";
import { useChainConfig } from "hooks";

export const useSession = () => {
  const params = useParams();

  const filter = useMemo((): SessionsFilter | undefined => {
    if (isTxHash(params.identifier)) {
      return {
        must: [{ keyword: "txHash", value: params.identifier as string }],
        should: undefined,
      };
    }
    return {
      must: [{ keyword: "sessionId", value: params.identifier as string }],
      should: undefined,
    };
  }, [params]);

  return useQuery({
    queryKey: [queryKey.session, filter],
    queryFn: async ({ signal }) => {
      const result = await clob.getSessions({
        signal,
        filter,
      });

      return handleSession(result);
    },
    staleTime: Infinity,
  });
};

export const useSessionTx = () => {
  const session = useSession().data;
  return useTxDetailsQuery(session);
};


export const handleSession = async (
  sessions: ClobSession[]
): Promise<ClobSession | null> => {
  const session = _.first(sessions);
  
  if (!session) return null;
  
  return {
    ...session,
    dexAmountOut: await fromatTokenDecimals(session.tokenOutAddress!!, session.amountOutRaw?.toString() ?? "0", Number(session.chainId)),
    dexAmountIn: await fromatTokenDecimals(session.tokenInAddress!!, session.amountInRaw?.toString() ?? "0", Number(session.chainId)),
  };
};



const fromatTokenDecimals = async (tokenAddress: string, amount: string, chainId: number) => {
  if (!tokenAddress) return undefined;

  const web3 = getWeb3(chainId);
  if (!web3) return undefined;
  const contract = getContract(web3, tokenAddress);
  

  if (!contract ) return undefined;
  let decimals;

  try {
    if (isNativeAddress(tokenAddress)) {
      decimals = 18;
    } else {
      decimals =
      contract && ((await contract.methods.decimals().call()) as number);
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
  if (!decimals) return undefined;

  try {
    return amountUi(decimals, new BN(amount));
  } catch (error) {
    console.log(error);
  }
};

export const useSessionChainConfig = () => {
  const chainId = useSession().data?.chainId;
  return useChainConfig(chainId);
}