/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchInput } from "@/components/SearchInput";
import { URL_QUERY_KEYS } from "@/consts";
import { useAppParams } from "@/hooks";
import { useCallback } from "react";
import {
  resolveOrderIdentifier,
  validateOrderIdentifier,
} from "@/utils";
import { QueryFilters } from "@/components/query-filters";
import { OrderStatus } from "@orbs-network/twap-sdk";

const OrderIdFilter = () => {
  return (
    <QueryFilters.BadgeWithInput
      queryKey={URL_QUERY_KEYS.ORDER_ID}
      label="Order IDs"
      placeholder="Order ID"
    />
  );
};


const statusOptions = [

    { label: "Open", value: OrderStatus.Open.toLowerCase() },
    { label: "Completed", value: OrderStatus.Completed.toLowerCase() },
    { label: "Expired", value: OrderStatus.Expired.toLowerCase() },
    { label: "Canceled", value: OrderStatus.Canceled.toLowerCase() },
]

const StatusFilter = () => {
  return (
    <QueryFilters.Badge
      queryKey={URL_QUERY_KEYS.ORDER_STATUS}
      label="Status"
      options={statusOptions}
    />
  );
};

const orderTypeOptions = [
  { label: "Limit", value: "limit" },
  { label: "Market", value: "market" },
];

const OrderTypeFilter = () => {
  return (
    <QueryFilters.Badge
      queryKey={URL_QUERY_KEYS.ORDER_TYPE}
      label="Order Type"
      options={orderTypeOptions}
      singleSelect
    />
  );
};



export function OrderSearchInput({ className = "" }: { className?: string }) {
  const { setQuery, query } = useAppParams();

  const onSubmit = useCallback(
    (orderIdentifier: string) => {
      if (!validateOrderIdentifier(orderIdentifier)) {
        alert("Invalid order identifier");
        return;
      }
      const newQuery: any = {
        ...query,
      };
      const resolvedIdentifier = resolveOrderIdentifier(orderIdentifier);

      Object.entries(resolvedIdentifier).forEach(([key, value]) => {
        if (value?.length) {
          const currentValue = (newQuery[key as keyof typeof query] ||
            []) as string[];
          newQuery[key as keyof typeof newQuery] = [...currentValue, ...value];
        }
      });

      setQuery.updateQuery(newQuery);
    },
    [setQuery, query]
  );

  return (
    <SearchInput
      className={className}
      onSubmit={onSubmit}
      placeholder="Tx Hash / Order Id / Address"
    />
  );
}

export const OrdersFilter = () => {
  return (
    <QueryFilters>
      <OrderIdFilter />
      <StatusFilter />
      <OrderTypeFilter />
    </QueryFilters>
  );
};
