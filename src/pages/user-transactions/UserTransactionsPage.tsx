import _ from "lodash";
import { useMemo } from "react";
import { TransactionsList } from "components";
import { Page } from "components/Page";
import { useLiquidityHubSwaps } from "applications";
import { useParams } from "react-router";

export const UserTransactionsPage = () => {
  const walletAddress = useParams().address;

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useLiquidityHubSwaps(walletAddress);

  const sessions = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  return (
    <Page navbar={<Page.Navbar.LiquidityHub />}>
      <Page.Layout>
        <TransactionsList
          sessions={sessions}
          loadMore={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
        />
      </Page.Layout>
    </Page>
  );
};
