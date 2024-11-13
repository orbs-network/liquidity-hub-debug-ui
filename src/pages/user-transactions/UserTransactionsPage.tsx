import _ from "lodash";
import { useMemo } from "react";
import { useSwapsQuery } from "query";
import { TransactionsList } from "components";
import { useParams } from "react-router-dom";
import { Page } from "components/Page";

export const UserTransactionsPage = () => {
  const { address } = useParams();

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useSwapsQuery(address);

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
