import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { amountUiV2, getContract, getTokenDetails, isTxHash } from "../../../helpers";
import { queryKey, useTxDetailsQuery } from "../../../query";
import { SessionsFilter } from "../../../types";
import { clob } from "applications";
import { isNativeAddress } from "@defi.org/web3-candies";
import { useChainConfig, useWeb3 } from "hooks";
import BN from "bignumber.js";

export const useAmountUI = (decimals?: number, value?: string | BN) => {
  return useMemo(
    () => amountUiV2(decimals, value),
    [decimals, value?.toString()]
  );
};


export const useToken = (tokenAddress?: string, chainId?: number) => {
  const w3 = useWeb3(chainId);

  return useQuery({
    queryKey: ["useGetToken", tokenAddress, chainId],
    queryFn: async () => {
      return getTokenDetails(tokenAddress!, w3!, chainId!);
    },
    enabled: !!tokenAddress && !!chainId && !!w3,
    staleTime: Infinity,
  });
};


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
    queryKey: [queryKey.session, params.identifier],
    queryFn: async ({ signal }) => {
      const sessions = await clob.getSessions({
        signal,
        filter,
      });

      return sessions[0];
    },
    staleTime: Infinity,
  });
};

export const useSessionTx = () => {
  const session = useSession().data;
  return useTxDetailsQuery(session);
};
