/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchInput } from "@/components/SearchInput";
import { URL_QUERY_KEYS } from "@/consts";
import { useAppParams } from "@/hooks";
import { useCallback } from "react";
import { resolveOrderIdentifier, validateOrderIdentifier } from "@/utils";
import { QueryFilters } from "@/components/query-filters";

const MinDollarValueFilter = () => {
  return (
    <QueryFilters.Input
      placeholder="Input Fee Out Amount USD"
      queryKey={URL_QUERY_KEYS.FEE_OUT_AMOUNT_USD}
      label="Fee Out Amount USD"
    />
  );
};

const FilterModal = () => {
  return (
    <QueryFilters>
      <MinDollarValueFilter />
    </QueryFilters>
  );
};

function OrderInputFilter({ className = "" }: { className?: string }) {
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

export const LiquidityHubTransactionsFilter = () => {
  return (
    <div className="flex flex-col gap-2 w-full sticky top-[70px] z-10 bg-background">
      <div className="flex items-center gap-2 w-full justify-between mb-4">
        <OrderInputFilter className="flex-1 max-w-[700px] h-[40px] text-[16px]" />
        <FilterModal />
      </div>
      <QueryFilters.Active />
    </div>
  );
};
