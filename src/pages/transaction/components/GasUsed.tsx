import { useNumberFormatter, useChainConfig } from "hooks";
import { useMemo } from "react";
import { useGasCostUsd } from "../hooks";
import BN from "bignumber.js";
import { DataDisplay } from "components";
import { useLiquidityHubSession } from "applications";

export const GasUsed = () => {
  const session = useLiquidityHubSession().data;
  const amount = useMemo(() => {
    return BN(session?.gasUsedNativeToken || 0)
      .dividedBy(1e9)
      .toString();
  }, [session?.gasUsedNativeToken]);

  const usd = useGasCostUsd();
  const gas = useNumberFormatter({
    value: amount,
  });
  const _usd = useNumberFormatter({ value: usd });
  const chainConfig = useChainConfig(session?.chainId);

  return (
    <DataDisplay.Row label="Gas Used">
      <DataDisplay.TokenAmount
        amount={gas as string}
        usd={_usd as string}
        symbol={chainConfig?.native.symbol}
        address={chainConfig?.native.address}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};
