import { SearchInput } from "@/components/SearchInput";
import { ROUTES } from "@/config";
import { useNavigateWithParams } from "@/hooks";
import { useCallback } from "react";

import { resolveOrderIdentifier, validateOrderIdentifier } from "@/utils";

export function TwapSearchInput({ className = "" }: { className?: string }) {
  const navigate = useNavigateWithParams();

  const onSubmit = useCallback(
    (orderIdentifier: string) => {
      if (!validateOrderIdentifier(orderIdentifier)) {
        alert("Invalid order identifier");
        return;
      }
      const resolvedIdentifier = resolveOrderIdentifier(orderIdentifier);
      navigate(ROUTES.twap.orders, resolvedIdentifier);
    },
    [navigate]
  );

  return (
    <SearchInput
      className={className}
      onSubmit={onSubmit}
      placeholder="Tx Hash / Order Id / Address"
    />
  );
}
