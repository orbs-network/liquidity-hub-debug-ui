
import { useCallback, useMemo, useState } from "react";
import { Page, TransactionsList } from "@/components";
import { ColumnFlex } from "@/styles";
import { Button, Input, Typography } from "antd";
import { useLiquidityHubSwaps } from "@/applications";
import { styled } from "styled-components";
import { MOBILE } from "@/consts";

export const TransactionsPage = () => {
  const [password, setPassword] = useState(localStorage.getItem("password"));
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useLiquidityHubSwaps();

  const sessions = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  const onSubmit = (password: string) => {
    if (password !== "lh-debug-1") return;
    localStorage.setItem("password", "1");
    setPassword("1");
  };

  return (
    <StyledLayout>
      {!password ? (
        <Password onSubmit={onSubmit} />
      ) : (
        <TransactionsList
          isFetchingNextPage={isFetchingNextPage}
          sessions={sessions}
          loadMore={fetchNextPage}
          isLoading={isLoading}
        />
      )}
    </StyledLayout>
  );
};

const StyledLayout = styled(Page.Layout)({
  [`@media (max-width: ${MOBILE}px)`]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

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
