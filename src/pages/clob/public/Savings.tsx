import BN from "bignumber.js";
import { useNumberFormatter, useTokenAmountUsd } from "hooks";
import { ListItem, WithSmall } from "./components/shared";
import { useAmountUI, useSession, useToken } from "./hooks";

export const Savings = () => {
    const session = useSession().data;
    const outToken = useToken(session?.tokenOutAddress, session?.chainId);
    if (Number(session?.savings) <= 1) return <div>-</div>;
  
    const amountWithDecimals = useAmountUI(
      outToken?.data?.decimals,
      BN(session?.savings || "0")
    );
    const usdValue = useNumberFormatter({
      value: useTokenAmountUsd(session?.tokenOutAddress, 18, session?.chainId),
      decimalScale: 3,
    });
    //@ts-ignore
    return (
      <ListItem label="Savings">
        <span>{session?.savings}</span>
        <WithSmall
          value={useNumberFormatter({
            value: amountWithDecimals,
            decimalScale: 3,
          })}
          smallValue={`$${usdValue}`}
        />
      </ListItem>
    );
  };
  
