import _ from "lodash";
import { useCallback, useMemo, useState } from "react";
import { useSwapsQuery } from "query";
import { Page, TransactionsList } from "components";
import { ColumnFlex } from "styles";
import { Button, Input, Typography } from "antd";

export const TransactionsPage = () => {
  const [password, setPassword] = useState(localStorage.getItem("password"));
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useSwapsQuery();

  const sessions = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);


  const onSubmit = (password: string) => {
    if(password !== "lg-debug-1") return;
    localStorage.setItem("password", '1');
    setPassword('1');
  }

  return (
    <Page navbar={<Page.Navbar />}>
      <Page.Layout>
       {!password ?  
        <Password onSubmit={onSubmit} />
       :  <TransactionsList
          isFetchingNextPage={isFetchingNextPage}
          sessions={sessions}
          loadMore={fetchNextPage}
          isLoading={isLoading}
        />}
      </Page.Layout>
    </Page>
  );
};


const Password = ({onSubmit}:{onSubmit: (value: string) => void}) => {
  const [value, setValue] = useState('')

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        onSubmit(value);
      }
    },
    [onSubmit, value],
  )

  return (
    <ColumnFlex>
      <Typography>Insert password</Typography>
      <Input onKeyDown={onKeyDown} onChange={(e) => setValue(e.target.value) } />
      <Button onClick={() => onSubmit(value)}>Submit</Button>
    </ColumnFlex>
  );
}