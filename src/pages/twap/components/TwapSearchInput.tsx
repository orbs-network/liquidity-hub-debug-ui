import { SearchInput } from "components/SearchInput";
import { useNavigateWithParams } from "hooks";
import { useCallback } from "react";
import { isValidWalletAddress, navigation } from "utils";

export function TwapSearchInput({
  className = "",
}: {
  className?: string;
}) {
  const navigate = useNavigateWithParams();

  const onSubmit = useCallback(
    (value: string) => {
      if (isValidWalletAddress(value)) {
        navigate(navigation.twap.maker(value));
      } else {
        navigate(navigation.twap.order(value));
      }
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
