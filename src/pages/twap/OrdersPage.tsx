import { useTwapOrders } from "applications/twap";
import { Page } from "components";

import { useAppParams } from "hooks";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { TwapOrdersList } from "./components/twap-orders-list";

export function OrdersPage() {
  const { query } = useAppParams();
  const { maker } = useParams();

  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useTwapOrders(
    query.chainId,
    query.partner,
    maker
  );
  const orders = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  return (
   <Page.Layout>
     <TwapOrdersList
      loadMore={fetchNextPage}
      orders={orders}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
    />
   </Page.Layout>
  );
}
