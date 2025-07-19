import { DataDisplay } from "@/components";
import { useAmountUI, useToken } from "@/hooks";
import { useOutTokenUsd } from "../hooks";
import { useLiquidityHubSession } from "@/lib/queries/use-liquidity-hub-swaps";



export const UserSavings = () => {
  const session = useLiquidityHubSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId)?.data;
  const savings = session?.userSavings
    
  const amount = useAmountUI(outToken?.decimals, savings);

  const usd = useOutTokenUsd(amount)

  return (
    <DataDisplay.Row label="User Savings">
      <DataDisplay.FormattedTokenAmountFromWei
        amount={amount as string}
        usd={usd as string}
        address={outToken?.address}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};
