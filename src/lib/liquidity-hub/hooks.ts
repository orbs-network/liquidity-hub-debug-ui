import { Field, LiquidityHubSwap, SwapQueryResponse } from "./types";
import { useCallback, useMemo } from "react";
import BN from "bignumber.js";
import { useUsdOracleQuery } from "../queries/use-usd-oracle-query";
import { useQuery } from "@tanstack/react-query";
import { getPublicClient } from "../lib";
import {
  getAmountReceivedPostDeductions,
  getERC20Transfers,
  getExpectedLhAmountOut,
  getLhExactOutAmountPreDeduction,
  getUserSavings,
} from "./lib";
import { getNetworkByChainId, getPartnersById, toAmountUI } from "../utils";
import { useToken } from "../queries/use-tokens-query";
import moment from "moment";

export const useOutTokenUsdCallback = (swap?: LiquidityHubSwap) => {
  const token = useToken(swap?.tokenOutAddress, swap?.chainId);

  return useCallback(
    (amountWei?: string | number) => {
      if (!swap || !token) return "0";
      const amount = toAmountUI(amountWei, token.decimals);
      const getUsdValue = (amount?: string | number, usd?: number | string) => {
        if (!amount || !usd) return "0";
        const res = BN(usd).dividedBy(toAmountUI(amount, token.decimals));
        return res.gt(0) ? res.toString() : undefined;
      };

      const usdSingleToken =
        getUsdValue(swap.amountOut, swap.dollarValue2) || "0";

      return BN(amount).times(usdSingleToken).toString();
    },
    [swap, token]
  );
};

export const useOutTokenUsd = (
  swap?: LiquidityHubSwap,
  amountWei?: string | number
) => {
  const getUsd = useOutTokenUsdCallback(swap);
  return useMemo(() => getUsd(amountWei), [getUsd, amountWei]);
};

export const useGasCostUsd = (swap?: LiquidityHubSwap) => {
  const gasPrice = useMemo(() => {
    if (!swap) return "0";
    const gasUsedNativeToken = BN(swap.gasUsed || 0)
      .times(swap.gasPriceGwei || 0)
      .toFixed();

    return BN(gasUsedNativeToken || 0)
      .dividedBy(1e9)
      .toString();
  }, [swap]);

  const usd = useUsdOracleQuery({
    address: getNetworkByChainId(swap?.chainId)?.wToken.address,
    chainId: swap?.chainId,
  }).data;

  return useMemo(() => {
    return BN(gasPrice)
      .times(usd || 0)
      .toString();
  }, [gasPrice, usd]);
};

export const useTransfers = (swap?: LiquidityHubSwap) => {
  return useQuery({
    queryKey: ["useTransfers", swap?.txHash],
    queryFn: async () => {
      if (!swap) {
        throw new Error("Swap is required");
      }
      const publicClient = getPublicClient(swap.chainId);

      const receipt = await publicClient?.getTransactionReceipt({
        hash: swap.txHash! as `0x${string}`,
      });

      if (!receipt) return null;
      return getERC20Transfers(receipt);
    },
    staleTime: Infinity,
    enabled: !!swap?.txHash && !!swap?.chainId,
  });
};

export const useBaseInfo = () => {
  return useMemo((): { title: string; items: Field[] } => {
    return {
      title: "base information",
      items: [
        {
          title: "Session ID",
          subtitle: "",
          value: ({ swap }: { swap: LiquidityHubSwap }) => swap.sessionId,
          type: "text",
        },
        {
          title: "Network",
          subtitle: "",
          value: ({ swap }: { swap: LiquidityHubSwap }) => {
            const network = getNetworkByChainId(swap.chainId);
            return {
              logoUrl: network?.logoUrl || "",
              value: network?.name || "",
            };
          },
          type: "avatar",
        },
        {
          title: "Dex",
          subtitle: "",
          value: ({ swap }: { swap: LiquidityHubSwap }) => {
            const partner = getPartnersById([swap.dex])?.[0];
            return {
              logoUrl: partner?.logo || "",
              value: partner?.name || "",
            };
          },
          type: "avatar",
        },
        {
          title: "Timestamp",
          subtitle: "",
          value: ({ swap }: { swap: LiquidityHubSwap }) =>
            moment(swap.timestamp).format("lll"),
          type: "text",
        },
        {
          title: "User",
          subtitle: "",
          type: "address",
          value: ({ swap }: { swap: LiquidityHubSwap }) => {
            return {
              value: swap.user || "",
              chainId: swap.chainId || 0,
              type: "address",
            };
          },
        },
        {
          title: "Slippage",
          subtitle: "",
          type: "text",
          value: ({ swap }: { swap: LiquidityHubSwap }) =>
            swap.slippage.toString(),
        },
        {
          title: "Transaction Hash",
          subtitle: "",
          type: "address",
          value: ({ swap }: { swap: LiquidityHubSwap }) => {
            return {
              value: swap.txHash || "",
              chainId: swap.chainId || 0,
              type: "tx",
            };
          },
        },
      ],
    };
  }, []);
};

export const useAmounts = (swap: LiquidityHubSwap) => {
  const getUsd = useOutTokenUsdCallback(swap);
  return useMemo((): { title: string; items: Field[] } => {
    return {
      title: "Amounts",
      items: [
        {
          title: "Amount In",
          subtitle: "",
          type: "amount",
          value: ({ swap }: SwapQueryResponse) => {
            return {
              value: swap.amountIn.toString(),
              address: swap.tokenInAddress,
              chainId: swap.chainId,
              usd: swap.amountInUSD.toString(),
            };
          },
        },
        {
          title: "Dex Amount Out",
          subtitle: "(minus gas)",
          tooltip: "The amount user would received via dex",
          type: "amount",
          value: ({ swap }: SwapQueryResponse) => {
            return {
              value: swap.dexSimulateOutMinusGas,
              address: swap.tokenOutAddress,
              chainId: swap.chainId,
              usd: getUsd(swap.dexSimulateOutMinusGas),
            };
          },
        },
        {
          title: "LH Amount Out",
          subtitle: "(estimate)",
          type: "amount",
          value: ({ swap, quote }: SwapQueryResponse) => {
            const value = getExpectedLhAmountOut(swap, quote);
            return {
              value,
              address: swap.tokenOutAddress,
              chainId: swap.chainId,
              usd: getUsd(value),
            };
          },
        },
        {
          title: "LH Amount Out",
          subtitle: "(actual pre deductions)",
          type: "amount",
          value: ({ swap, quote }: SwapQueryResponse) => {
            const value = getLhExactOutAmountPreDeduction(swap, quote);
            return {
              value,
              address: swap.tokenOutAddress,
              chainId: swap.chainId,
              usd: getUsd(value),
            };
          },
        },
        {
          title: "LH Amount Out",
          subtitle: "(actual post deductions)",
          type: "amount",
          value: ({ swap }: SwapQueryResponse) => {
            const value = getAmountReceivedPostDeductions(swap);
            return {
              value,
              address: swap.tokenOutAddress,
              chainId: swap.chainId,
              usd: getUsd(value),
            };
          },
        },
        {
          title: "Fees",
          subtitle: "",
          type: "amount",
          value: ({ swap }) => {
            return {
              value: swap.feeOutAmount,
              address: swap.tokenOutAddress,
              chainId: swap.chainId,
              usd: getUsd(swap.feeOutAmount),
            };
          },
        },
        {
          title: "User Savings",
          subtitle: "",
          type: "amount",
          value: ({ swap, quote }: SwapQueryResponse) => {
            const value = getUserSavings(swap, quote);
            return {
              value,
              address: swap.tokenOutAddress,
              chainId: swap.chainId,
              usd: getUsd(value),
            };
          },
        },
      ],
    };
  }, [getUsd]);
};


