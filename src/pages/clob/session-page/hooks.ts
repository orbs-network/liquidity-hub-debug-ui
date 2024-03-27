import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  amountUi,
  convertScientificStringToDecimal,
  getContract,
  getWeb3,
  isScientificStringToDecimal,
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
  const parseDexAmountOut = async () => {
    console.log(session.dexAmountOut);
    
    if (!session.dexAmountOut || !session.tokenOutAddress || !BN(session.dexAmountOut).gt(0)) return undefined;

    const web3 = getWeb3(session.chainId);
    if (!web3) return undefined;
    const contract = getContract(web3, session.tokenOutAddress);

    if (!contract) return undefined;
    let toTokenDecimals;

    try {
      if (isNativeAddress(session.tokenOutAddress)) {
        toTokenDecimals = 18;
      } else {
        toTokenDecimals =
          contract && ((await contract.methods.decimals().call()) as number);
      }
    } catch (error) {}
    if (!toTokenDecimals) return undefined;

    try {

         
          
      if (session.dexAmountOut && BN(session.dexAmountOut).gt(0) && isScientificStringToDecimal(session.dexAmountOut || '')) {        
        const _dexAmountOut = convertScientificStringToDecimal(
          session.dexAmountOut || '0',
          6
        );
        return amountUi(toTokenDecimals, new BN(_dexAmountOut ||'0'));
      }
      return amountUi(toTokenDecimals, new BN(session.dexAmountOut || '0'));
    } catch (error) {
      console.log(error);
    }
  };

  const dexAmountOut = await parseDexAmountOut();
  const getAmountOutDiff = () => {
    if (dexAmountOut === "-1") {
      return undefined;
    }

    // GET DIFF IN PERCENT  
    return BN(session.amountOutUI || "0")
      .dividedBy(BN( dexAmountOut || "0")).minus(1).multipliedBy(100).toNumber();
  };

  return {
    ...session,
    dexAmountOut: await parseDexAmountOut(),
    amountOutDiff: getAmountOutDiff(),
  };
};

export const useSessionChainConfig = () => {
  const chainId = useSession().data?.chainId;
  return useChainConfig(chainId);
};
