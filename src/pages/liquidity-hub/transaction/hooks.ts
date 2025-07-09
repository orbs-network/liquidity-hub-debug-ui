import { useQuery } from "@tanstack/react-query";
import { useToken, useTokenAmountUsd, useUSDPrice } from "@/hooks";
import { useMemo } from "react";
import BN from "bignumber.js";
import { useLiquidityHubSession } from "@/applications";
import { zeroAddress } from "@orbs-network/twap-sdk";
import { getERC20Transfers, getPublicClient } from "@/lib";
import { toAmountUI } from "@/helpers";

export const useTransfers = () => {
  const session = useLiquidityHubSession().data;
  return useQuery({
    queryKey: ["useTransfers", session?.txHash],
    queryFn: async () => {
      if (!session) return null;
      const publicClient = getPublicClient(session?.chainId);

      const receipt = await publicClient?.getTransactionReceipt({
        hash: session.txHash! as `0x${string}`,
      });

      if (!receipt) return null;

      return getERC20Transfers(receipt);
    },
    staleTime: Infinity,
    enabled: !!session?.txHash && !!session?.chainId,
  });
};

export const useOutTokenUsd = (amount = "1") => {
  const session = useLiquidityHubSession().data;
  const { data: outToken } = useToken(
    session?.tokenOutAddress,
    session?.chainId
  );
  const currentUsd = useUSDPrice(outToken?.address, session?.chainId).data;

  return useMemo(() => {
    if (!session || !outToken) return "0";

    const getUsdValue = (amount?: string, usd?: number | string) => {
      if (!amount || !usd) return "0";
      const res = BN(usd).dividedBy(toAmountUI(amount, outToken?.decimals));
      return res.gt(0) ? res.toString() : undefined;
    };

    const res = getUsdValue(session?.lhAmountOut, session?.lhAmountOutUsd);

    const usd = res || currentUsd?.toString() || "0";
    return BN(amount).times(usd).toString();
  }, [session, outToken, amount, currentUsd]);
};

export const useGasCostUsd = () => {
  const session = useLiquidityHubSession().data;

  const gasPrice = useMemo(() => {
    return BN(session?.gasUsedNativeToken || 0)
      .dividedBy(1e9)
      .toString();
  }, [session?.gasUsedNativeToken]);

  return useTokenAmountUsd(zeroAddress, gasPrice, session?.chainId);
};
