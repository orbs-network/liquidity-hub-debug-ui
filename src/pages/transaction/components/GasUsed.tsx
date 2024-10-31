import { useNumberFormatter, useChainConfig } from "hooks";
import { useMemo } from "react";
import { useGasCostUsd, useSession } from "../hooks";
import { ListItem, TokenAmount } from "./shared";
import BN from "bignumber.js";

export const GasUsed = () => {
  const session = useSession().data;
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
    <ListItem label="Gas used">
      <TokenAmount
        amount={gas as string}
        usd={_usd as string}
        symbol={chainConfig?.native.symbol}
        address={chainConfig?.native.address}
      />
    </ListItem>
  );
};
