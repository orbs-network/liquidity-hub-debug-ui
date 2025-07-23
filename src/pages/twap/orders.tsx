import { TwapOrdersTable } from "./components/twap-orders-table";
import { OrderSearchInput, OrdersFilter } from "./components/orders-filter";

import { DateSelector } from "@/components/date-selector";
import { QueryFilters } from "@/components/query-filters";
import { AuthWrapper } from "@/components/auth-wrapper";

export function OrdersPage() {


  return (
    <AuthWrapper>
      <div className="flex flex-col gap-1">
        <>
          <div className="flex flex-col gap-2 w-full top-[50px] z-10 bg-background sticky md:top-[70px]">
            <div className="flex items-center gap-2 w-full justify-between mb-4 md:flex-row flex-col">
              <OrderSearchInput className="flex-1 max-w-[700px] text-[16px] order-2 md:order-1" />
              <div className="flex items-center gap-2 ml-auto order-1 md:order-2">
                <OrdersFilter />
                <DateSelector custom />
              </div>
            </div>
          </div>
          <QueryFilters.Active />
        </>
        <TwapOrdersTable />
      </div>
    </AuthWrapper>
  );
}
