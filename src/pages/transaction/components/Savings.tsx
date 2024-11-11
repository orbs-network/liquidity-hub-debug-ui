import { DataDisplay } from "components";
import { useAmountUI, useToken } from "hooks";
import { useOutTokenUsd, useSession } from "../hooks";

export const Savings = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const savings =
    !session?.savings || Number(session?.savings) < 0 ? 0 : session?.savings;
  const amount = useAmountUI(outToken?.decimals, savings);

  const usd = useOutTokenUsd(amount);

  return (
    <DataDisplay.Row label="Savings">
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
