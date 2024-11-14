import { useLiquidityHubSession } from "applications";
import { DataDisplay } from "components";
import { useAmountUI, useToken } from "hooks";
import { useOutTokenUsd, useUserSavings } from "../hooks";



export const UserSavings = () => {
  const session = useLiquidityHubSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const savings = useUserSavings()
  
  const amount = useAmountUI(outToken?.decimals, savings);
  
  const usd = useOutTokenUsd(amount)

  return (
    <DataDisplay.Row label="User Savings">
      <DataDisplay.TokenAmount
        amount={amount as string}
        usd={usd as string}
        address={outToken?.address}
        symbol={outToken?.symbol}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};
