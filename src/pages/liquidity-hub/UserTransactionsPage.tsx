
import { useMemo } from "react";
import { TransactionsList } from "@/components";
import { Page } from "@/components/Page";
import { useLiquidityHubSwaps } from "@/applications";
import { useParams } from "react-router";
import { MOBILE } from "@/consts";
import { styled } from "styled-components";

export const UserTransactionsPage = () => {
  const walletAddress = useParams().user;

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useLiquidityHubSwaps(walletAddress);

  const sessions = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  return (
    <StyledLayout>
      <TransactionsList
        sessions={sessions}
        loadMore={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
      />
    </StyledLayout>
  );
};

const StyledLayout = styled(Page.Layout)({
  [`@media (max-width: ${MOBILE}px)`]: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});
