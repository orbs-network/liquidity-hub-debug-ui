
import { useCallback, useMemo, useState } from "react";
import { Page, TransactionsList } from "@/components";
import { ColumnFlex } from "@/styles";
import { Button, Input, Typography } from "antd";
import { LiquidityHubTransactionsFilter } from "./transactions-filter";

export const TransactionsPage = () => {
  const [password, setPassword] = useState(localStorage.getItem("password"));



  const onSubmit = (password: string) => {
    if (password !== "lh-debug-1") return;
    localStorage.setItem("password", "1");
    setPassword("1");
  };

  return (
    <>
      <LiquidityHubTransactionsFilter />
     <TransactionsList  />
    </>
  );
};



const Password = ({ onSubmit }: { onSubmit: (value: string) => void }) => {
  const [value, setValue] = useState("");

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit(value);
      }
    },
    [onSubmit, value]
  );

  return (
    <ColumnFlex>
      <Typography>Insert password</Typography>
      <Input onKeyDown={onKeyDown} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => onSubmit(value)}>Submit</Button>
    </ColumnFlex>
  );
};
