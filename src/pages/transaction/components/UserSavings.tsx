import { useAmountUI, useToken } from "hooks";
import { useOutTokenUsd, useSession, useUserSavings } from "../hooks";
import { ListItem, TokenAmount } from "./shared";


export const UserSavings = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const savings = useUserSavings()
  
  const amount = useAmountUI(outToken?.decimals, savings);
  
  const usd = useOutTokenUsd(amount)

  return (
    <ListItem label="User Savings">
      <TokenAmount
        amount={amount as string}
        usd={usd as string}
        address={outToken?.address}
        symbol={outToken?.symbol}
      />
    </ListItem>
  );
};
