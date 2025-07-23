import { useUsdOracleQuery } from "@/lib/queries/use-usd-oracle-query";
import BN from "bignumber.js";
import { abbreviate, cn } from "@/lib/utils";
import { TokenAddress } from "./Address";
import { useAmountUI } from "@/lib/hooks/use-amount-ui";
import { useMemo } from "react";
import { useToken } from "@/lib/queries/use-tokens-query";

export const TokenAmount = ({
  address,
  amountWei,
  chainId,
  amountUI,
  className,
  usd: _usd,
  useUsdOracle = false
}: {
  address?: string;
  amountWei?: string | number;
  chainId?: number;
  amountUI?: string;
  className?: string;
  usd?: string | number;
  useUsdOracle?: boolean;
}) => {
  const token = useToken(address, chainId)
  const fromWeiAmount = useAmountUI(token?.decimals, amountWei);
  const { data: usdFallback } = useUsdOracleQuery({
    address,
    chainId,
    disabled: !useUsdOracle,
  });

  const amount = amountUI || fromWeiAmount;
  const amountF = useMemo(() => abbreviate(amount), [amount]);
  const usdFallbackF = useMemo(() => {
    return BN(usdFallback || 0)
      .multipliedBy(amount)
      .toFixed();
  }, [amount, usdFallback]);

  const usd = useMemo(
    () => abbreviate(_usd || usdFallbackF, 2),
    [_usd, usdFallbackF]
  );

  return (
    <div className={cn("flex flex-row gap-2", className)}>
      {amountF || "0"}

      <TokenAddress
        address={address}
        chainId={chainId}
        symbol={token?.symbol}
      />
      <p className="text-sm text-secondary-foreground font-mono">{` ($${
        usd || "0"
      })`}</p>
    </div>
  );
};