/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchInput } from "@/components/SearchInput";
import { URL_QUERY_KEYS } from "@/consts";
import { useCallback } from "react";
import { QueryFilters } from "@/components/query-filters";
import { isValidLHTxId, isValidWalletAddress } from "@/lib/utils";
import { isHash } from "viem";
import { useQueryFilterParams } from "@/lib/hooks/use-query-filter-params";

const MinDollarValueFilter = () => {
  return (
    <QueryFilters.Input
      placeholder="Input Fee Out Amount USD"
      queryKey={URL_QUERY_KEYS.FEE_OUT_AMOUNT_USD}
      label="Fee Out Amount USD"
    />
  );
};

const SwapStatusFilterOptions = [
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
];

const SwapStatusFilter = () => {
  return (
    <QueryFilters.Badge
      queryKey={URL_QUERY_KEYS.SWAP_STATUS}
      label="Swap Status"
      options={SwapStatusFilterOptions}
      singleSelect
    />
  );
};

const FilterModal = () => {
  return (
    <QueryFilters>
      <MinDollarValueFilter />
      <SwapStatusFilter />
    </QueryFilters>
  );
};

const resolveLHTxIdentifier = (identifier: string) => {
  const parsedIdentifiers = identifier.split(",");

  const result: Record<string, string[] | undefined> = {};

  for (const value of parsedIdentifiers) {
    if (isValidWalletAddress(value)) {
      result[URL_QUERY_KEYS.USER] = [
        ...(result[URL_QUERY_KEYS.USER] || []),
        value,
      ];
    }
    if (isHash(value)) {
      result[URL_QUERY_KEYS.TX_HASH] = [
        ...(result[URL_QUERY_KEYS.TX_HASH] || []),
        value,
      ];
    }
    if (isValidLHTxId(value)) {
      result[URL_QUERY_KEYS.SESSION_ID] = [
        ...(result[URL_QUERY_KEYS.SESSION_ID] || []),
        value,
      ];
    }
  }

  return result;
};

function TransactionsInputFilter({ className = "" }: { className?: string }) {
  const { setQuery, query } = useQueryFilterParams();

  const onSubmit = useCallback(
    (orderIdentifier: string) => {
      if (!orderIdentifier) {
        alert("Invalid order identifier");
        return;
      }
      const newQuery: any = {
        ...query,
      };
      const resolvedIdentifier = resolveLHTxIdentifier(orderIdentifier);

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
      placeholder="Tx Hash / Session Id / User"
    />
  );
}

export const LiquidityHubTransactionsFilter = () => {
  return (
    <div className="flex flex-col gap-2 w-full sticky top-[70px] z-10 bg-background">
      <div className="flex items-center gap-2 w-full justify-between mb-4">
        <TransactionsInputFilter className="flex-1 max-w-[700px] h-[40px] text-[16px]" />
        <FilterModal />
      </div>
      <QueryFilters.Active />
    </div>
  );
};
