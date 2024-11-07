import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { amountUiV2, getERC20Transfers } from "helpers";
import { queryKey, useUSDPriceQuery } from "query";
import { clob } from "applications";
import { useToken, useTokenAmountUsd, useWeb3 } from "hooks";
import { useMemo } from "react";
import BN from "bignumber.js";
import { zeroAddress } from "@defi.org/web3-candies";

export const useSession = () => {
  const params = useParams();

  return useQuery({
    queryKey: [queryKey.session, params.identifier],
    queryFn: async ({ signal }) => {
      const session = await clob.getSession(params.identifier!, signal);

      return session;
    },
    staleTime: Infinity,
    enabled: !!params.identifier,
  });
};

export const useTransfers = () => {
  const session = useSession().data;
  const web3 = useWeb3(session?.chainId);
  return useQuery({
    queryKey: [queryKey.txDetails, session?.txHash],
    queryFn: async () => {
      if (!session) return null;

      const receipt = await web3?.eth.getTransactionReceipt(session.txHash!);

      const logs = receipt?.logs;
      if (!logs) return null;

      return getERC20Transfers(web3!, logs!, session.chainId!);
    },
    staleTime: Infinity,
    enabled: !!session?.txHash && !!web3 && !!session?.chainId,
  });
};

export const useOutTokenUsd = (amount = "1") => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const currentUsd = useUSDPriceQuery(outToken?.address, session?.chainId).data;

  return useMemo(() => {
    if (!session || !outToken) return "0";

    const getUsdValue = (amount?: string, usd?: number | string) => {
      if (!amount || !usd) return "0";
      const res = BN(usd).dividedBy(amountUiV2(outToken?.decimals, amount));
      return res.gt(0) ? res.toString() : undefined;
    };

    const res = getUsdValue(session?.lhAmountOut, session?.lhAmountOutUsd);

    const usd = res || currentUsd?.toString() || "0";
    return BN(amount).times(usd).toString();
  }, [session, outToken, amount, currentUsd]);
};

export const useGasCostUsd = () => {
  const session = useSession().data;

  const gasPrice = useMemo(() => {
    return BN(session?.gasUsedNativeToken || 0)
      .dividedBy(1e9)
      .toString();
  }, [session?.gasUsedNativeToken]);

  return useTokenAmountUsd(zeroAddress, gasPrice, session?.chainId);
};

export const useExactAmountOutPreDeduction = () => {
  const session = useSession().data;

  return useMemo(() => {
    return BN(session?.exactOutAmount || 0)
      .plus(session?.gasCostOutToken || 0)
      .plus(session?.feeOutAmount || 0)
      .toString();
  }, [session]);
};

export const useDexAmountOutMinusGas = () => {
  const session = useSession().data;

  return useMemo(() => {
    return BN(session?.dexAmountOut || 0)
      .minus(session?.gasCostOutToken || 0)
      .decimalPlaces(0)
      .toFixed();
  }, [session]);
};

export const useUserSavings = () => {
  const session = useSession().data;

  const dexAmountMinusGas = useDexAmountOutMinusGas();
  const exactOutAmount = session?.exactOutAmount;

  return useMemo(() => {
    return BN(exactOutAmount || 0)
      .minus(dexAmountMinusGas)
      .toString();
  }, [session, dexAmountMinusGas, exactOutAmount]);
};

export const useExpectedToReceiveLH = () => {
  const session = useSession().data;
  return useMemo(
    () =>
      BN(session?.lhAmountOut || 0)
        .minus(session?.gasCostOutToken || 0)
        .decimalPlaces(0)
        .toFixed(),
    [session]
  );
};
