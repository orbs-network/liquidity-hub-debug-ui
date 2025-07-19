import { TwapOrdersTable } from "./components/twap-orders-table";
import { OrderSearchInput, OrdersFilter } from "./components/orders-filter";
import { useAppParams } from "@/hooks";
import { useEffect } from "react";
import { DateSelector } from "@/components/date-selector";
import { QueryFilters } from "@/components/query-filters";

export function OrdersPage() {
  const {
    query: { partner_id },
    setQuery,
  } = useAppParams();

  useEffect(() => {
    if (!partner_id) {
      setQuery.updateQuery({
        partner_id: "pancakeswap",
      });
    }
  }, [partner_id, setQuery]);

  return (
    <div className="flex flex-col gap-1">
      <>
        <div className="flex flex-col gap-2 w-full top-[70px] z-10 bg-background sticky">
          <div className="flex items-center gap-2 w-full justify-between mb-4">
            <OrderSearchInput className="flex-1 max-w-[700px] h-[40px] text-[16px]" />
            <div className="flex items-center gap-2 ml-auto">
              <OrdersFilter />
              <DateSelector custom />
            </div>
          </div>
        </div>
        <QueryFilters.Active />
      </>
      <TwapOrdersTable />
    </div>
  );
}
