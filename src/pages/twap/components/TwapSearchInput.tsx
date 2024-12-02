import { SearchInput } from "components/SearchInput";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isValidWalletAddress, navigation } from "utils";

export function TwapSearchInput({
  className = "",
}: {
  className?: string;
}) {
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (value: string) => {
      if (isValidWalletAddress(value)) {
        navigate(navigation.twap.maker(value));
      } else {
        navigate(navigation.twap.order(Number(value)));
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
