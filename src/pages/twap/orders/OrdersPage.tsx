import { useTwapOrders } from "applications/twap";
import { Page } from "components";
import { useAppParams } from "hooks";
import { useEffect, useMemo } from "react";
import { TwapOrdersList } from "../components/twap-orders-list";

export function OrdersPage() {
  const { query, setQuery } = useAppParams();
  useEffect(() => {
    if (!query.chainId) {
      setQuery({ chainId: 1 });
    }
  }, [query.chainId]);

  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useTwapOrders(
    query.chainId,
    query.exchangeAddress
  );
  const orders = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  return (
    <Page navbar={<Page.Navbar.Twap />}>
      <Page.Layout>
        <TwapOrdersList
          loadMore={fetchNextPage}
          orders={orders}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
        />
      </Page.Layout>
    </Page>
  );
}
