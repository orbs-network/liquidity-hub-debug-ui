import { SearchInput } from "@/components/SearchInput";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isValidWalletAddress, navigation } from "@/utils";

export function LiquidityHubSearchInput({
  className = "",
}: {
  className?: string;
}) {
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (value: string) => {
      if (isValidWalletAddress(value)) {
        navigate(navigation.liquidityHub.user(value));
      } else {
        navigate(navigation.liquidityHub.tx(value));
      }
    },
    [navigate]
  );

  return (
    <SearchInput
      className={className}
      onSubmit={onSubmit}
      placeholder="Tx Hash / Session ID / Address"
    />
  );
}
