import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  amountUi,
  convertScientificStringToDecimal,
  getContract,
  isScientificStringToDecimal,
  isTxHash,
} from "../../../helpers";
import { queryKey, useTxDetailsQuery, useUSDPriceQuery } from "../../../query";
import { ClobSession, SessionsFilter } from "../../../types";
import BN from "bignumber.js";
import { clob } from "applications";
import { isNativeAddress } from "@defi.org/web3-candies";
import { useChainConfig, useWeb3 } from "hooks";
import axios from "axios";
import {TX_TRACE_SERVER} from "../../../config";

export const useRawSession = () => {
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
      const sessions = await clob.getSessions({
        signal,
        filter,
      });
      return _.first(sessions);
    },
    staleTime: Infinity,
  });
};

export const useLogTrace = () => {
  const session = useRawSession().data;

  return useQuery({
    queryKey: ["useLogTrace", session?.id],
    queryFn: async ({ signal }) => {
      if (!session) return;
      const result = await axios.post(
          TX_TRACE_SERVER,
        {
          chainId: session.chainId,
          blockNumber: session.blockNumber,
          txData: session.txData,
        },
        {
          signal,
        }
      );        
      return result.data;
    },
  });
};

export const useSessionTx = () => {
  const session = useRawSession().data;
  return useTxDetailsQuery(session);
};

export const useSession = () => {
  const session = useRawSession().data;

  const toTokenDecimals = useTokenDecimals(session?.tokenOutAddress);

  const toTokenUsd = useUSDPriceQuery(session?.tokenOutAddress).data;
  return useMemo(() => {
    if (!session) return;
    const dexAmountOut =
      toTokenDecimals && getDexAmountOut(session, toTokenDecimals);
    const { estimatedGasCost, actualGasCost } = handleGasPrice(
      session,
      toTokenDecimals
    );

    return {
      ...session,
      dexAmountOut,
      amountOutDiff: dexAmountOut
        ? getAmountOutDiff(session, dexAmountOut)
        : undefined,
      estimatedGasCost,
      estimatedGasCostUsd: BN(estimatedGasCost || "0").multipliedBy(
        BN(toTokenUsd || "0")
      ),
      actualGasCost,
      actualGasCostUsd: BN(actualGasCost || "0").multipliedBy(
        BN(toTokenUsd || "0")
      ),
    };
  }, [toTokenDecimals, session]);
};
// gasPriceGwei

const handleGasPrice = (session: ClobSession, decimals?: number) => {
  if (!decimals) return { estimatedGasCost: "0", actualGasCost: "0" };
  return {
    estimatedGasCost: amountUi(decimals, BN(session.gasCost || "0")),
    actualGasCost: BN(session.gasUsed || "")
      .multipliedBy(BN(session.gasPriceGwei || "0"))
      .dividedBy(1e9)
      .toString(),
  };
};

const getAmountOutDiff = (session: ClobSession, dexAmountOut?: string) => {
  if (dexAmountOut === "-1") {
    return undefined;
  }

  // GET DIFF IN PERCENT
  return BN(session.amountOutUI || "0")
    .dividedBy(BN(dexAmountOut || "0"))
    .minus(1)
    .multipliedBy(100)
    .toNumber();
};

const getDexAmountOut = (session: ClobSession, toTokenDecimals: number) => {
  if (
    !session.dexAmountOut ||
    !session.tokenOutAddress ||
    !BN(session.dexAmountOut).gt(0)
  ) {
    return undefined;
  }

  try {
    if (
      session.dexAmountOut &&
      BN(session.dexAmountOut).gt(0) &&
      isScientificStringToDecimal(session.dexAmountOut || "")
    ) {
      const _dexAmountOut = convertScientificStringToDecimal(
        session.dexAmountOut || "0",
        6
      );
      return amountUi(toTokenDecimals, new BN(_dexAmountOut || "0"));
    }
    return amountUi(toTokenDecimals, new BN(session.dexAmountOut || "0"));
  } catch (error) {
    console.log(error);
  }
};

const useTokenDecimals = (tokenAddress?: string) => {
  const session = useRawSession().data;

  const web3 = useWeb3(session?.chainId);

  const query = useQuery({
    queryKey: ["useTokenDecimals", tokenAddress, session?.chainId],
    queryFn: async () => {
      if (isNativeAddress(tokenAddress!)) {
        return 18;
      } else {
        if (!web3) {
          return undefined;
        }
        const contract = getContract(web3, tokenAddress!);

        return (await contract.methods.decimals().call()) as number;
      }
    },
    enabled: !!tokenAddress && !!web3 && !!session?.chainId,
  });
  return query.data;
};

export const useSessionChainConfig = () => {
  const chainId = useRawSession().data?.chainId;
  return useChainConfig(chainId);
};
