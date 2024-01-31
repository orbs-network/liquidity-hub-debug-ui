import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import {
  convertScientificStringToDecimal,
  getContract,
  getRpc,
  isScientificStringToDecimal,
  isTxHash,
} from "../../helpers";
import { amountUi, queryKey, useTxDetailsQuery } from "../../query";
import { Session, SessionsFilter } from "../../types";
import BN from "bignumber.js";

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
      const result = await api.getSessions({
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
  return useTxDetailsQuery(session)
};

export const handleSession = async (
  sessions: Session[]
): Promise<Session | null> => {
  const session = _.first(sessions);

  if (!session) return null;
  const { dexAmountOut } = session;
  const parseDexAmountOut = async () => {
    if (!dexAmountOut || !session.tokenOutAddress) return undefined;

    const web3 = getRpc(session.chainId);
    if (!web3) return undefined;
    const contract = getContract(web3, session.tokenOutAddress);
    if (!contract) return undefined;
    let toTokenDecimals;

    try {
      toTokenDecimals =
        contract && ((await contract.methods.decimals().call()) as number);
      if (!toTokenDecimals) return undefined;
      if (isScientificStringToDecimal(dexAmountOut)) {
        const _dexAmountOut = convertScientificStringToDecimal(dexAmountOut, 6);
        return amountUi(toTokenDecimals, new BN(_dexAmountOut));
      }
      return amountUi(toTokenDecimals, new BN(dexAmountOut));
    } catch (error) {}
  };
  return {
    ...session,
    dexAmountOut: await parseDexAmountOut(),
  };
};
