import { useAmountUI, useNumberFormatter, useTokenAmountUsd } from "hooks";
import { ListItem, TokenAmount } from "./components/shared";
import { useSession, useToken } from "./hooks";

export const Savings = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const savings =
    !session?.savings || Number(session?.savings) < 0 ? 0 : session?.savings;
  const amount = useAmountUI(outToken?.decimals, savings);
  const usd = useNumberFormatter({
    value: useTokenAmountUsd(
      session?.tokenOutAddress,
      amount,
      session?.chainId
    ),
    decimalScale: 3,
  });

  return (
    <ListItem label="Savings">
      <TokenAmount
        amount={amount}
        usd={usd as string}
        address={outToken?.address}
        symbol={outToken?.symbol}
      />
    </ListItem>
  );
};
