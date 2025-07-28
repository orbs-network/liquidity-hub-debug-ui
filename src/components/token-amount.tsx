import { useUsdOracleQuery } from "@/lib/queries/use-usd-oracle-query";
import BN from "bignumber.js";
import { abbreviate, cn } from "@/lib/utils";
import { TokenAddress } from "./Address";
import { useAmountUI } from "@/lib/hooks/use-amount-ui";
import { useMemo } from "react";
import { useToken } from "@/lib/queries/use-tokens-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useToWeiAmount } from "@/lib/hooks/use-to-wei-amout";
import { Skeleton } from "./ui/skeleton";
import { Copy } from "react-feather";
import { useCopy } from "@/hooks/use-copy";

export const TokenAmount = (props: {
  address?: string;
  amountWei?: string | number;
  chainId?: number;
  amountUI?: string;
  className?: string;
  usd?: string | number;
  useUsdOracle?: boolean;
}) => {
  const token = useToken(props.address, props.chainId)
  const _amountWei = useToWeiAmount(token?.decimals, props.amountUI);
  const _amountUI = useAmountUI(token?.decimals, props.amountWei);
  const copy = useCopy()
  const { data: usdFallback } = useUsdOracleQuery({
    address: props.address,
    chainId: props.chainId,
    disabled: !props.useUsdOracle,
  });

  const amountWei = props.amountWei || _amountWei;
  const amountUI = props.amountUI || _amountUI;
  const amountF = useMemo(() => abbreviate(amountUI, 3), [amountUI]);
  const usdFallbackF = useMemo(() => {
    return BN(usdFallback || 0)
      .multipliedBy(amountUI)
      .toFixed();
  }, [amountUI, usdFallback]);

  const fullUsd = props.usd || usdFallbackF;

  const usd = useMemo(() => abbreviate(fullUsd, 2), [fullUsd]);

  if(!token) {
    return <Skeleton className="w-[80px] h-[15px]" />;
  }

  return (
    <div className={cn("flex flex-row gap-2", props.className)}>
      <Tooltip>
        <TooltipTrigger>
          {amountF || "0"}
        </TooltipTrigger>
        <TooltipContent className="flex flex-row gap-2">
         <p className="text-[15px] font-mono">{amountWei || "0"}</p>
         <Copy className="w-4 h-4 cursor-pointer" onClick={() => copy(amountWei.toString())} />

        </TooltipContent>
      </Tooltip>

      <TokenAddress
        address={props.address}
        chainId={props.chainId}
        symbol={token?.symbol}
      />
    {usd && usd !== "0" &&  <Tooltip>
      <TooltipTrigger>
        <p className="text-sm text-secondary-foreground font-mono">{` ($${
          usd || "0"
        })`}</p>
      </TooltipTrigger>
      <TooltipContent className="flex flex-row gap-2">
        <p className="text-[15px] text-secondary-foreground font-mono">{` ($${
          abbreviate(fullUsd, 7) || "0"
        })`}</p>
        <Copy className="w-4 h-4 cursor-pointer" onClick={() => copy(fullUsd.toString())} />
      </TooltipContent>
     </Tooltip>}
    </div>
  );
};