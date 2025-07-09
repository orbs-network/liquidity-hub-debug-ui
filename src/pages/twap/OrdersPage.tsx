import { Page } from "@/components";
import { useMemo } from "react";
import { TwapOrdersList } from "./components/twap-orders-list";
import { useTwapOrdersQuery } from "@/lib/queries/use-twap-orders-query";

export function OrdersPage() {

  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useTwapOrdersQuery();
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
