import { useChainConfig } from "hooks";
import { useMemo } from "react";
import { useGasCostUsd } from "../hooks";
import BN from "bignumber.js";
import { DataDisplay } from "components";
import { useLiquidityHubSession } from "applications";

export const GasUsed = () => {
  const session = useLiquidityHubSession().data;
  const gas = useMemo(() => {
    return BN(session?.gasUsedNativeToken || 0)
      .dividedBy(1e9)
      .toString();
  }, [session?.gasUsedNativeToken]);

  const usd = useGasCostUsd();

  const chainConfig = useChainConfig(session?.chainId);

  return (
    <DataDisplay.Row label="Gas Used">
      <DataDisplay.TokenAmount
        amount={gas as string}
        usd={usd as string}
        address={chainConfig?.native.address}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};
