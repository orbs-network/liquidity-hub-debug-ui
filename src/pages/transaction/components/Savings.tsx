import { useAmountUI } from "hooks";
import { useOutTokenUsd, useSession, useToken } from "../hooks";
import { ListItem, TokenAmount } from "./shared";


export const Savings = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const savings =
    !session?.savings || Number(session?.savings) < 0 ? 0 : session?.savings;
  const amount = useAmountUI(outToken?.decimals, savings);
  
  const usd = useOutTokenUsd(amount)

  return (
    <ListItem label="Savings">
      <TokenAmount
        amount={amount as string}
        usd={usd as string}
        address={outToken?.address}
        symbol={outToken?.symbol}
      />
    </ListItem>
  );
};
