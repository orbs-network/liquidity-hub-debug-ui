import { Badge } from "@chakra-ui/react";
import { swapStatusText } from "helpers";

export const StatusBadge = ({ swapStatus }: { swapStatus?: string }) => {
  const colorScheme =
    swapStatus === "success"
      ? "green"
      : swapStatus === "failed"
      ? "red"
      : undefined;
  return (
    <Badge
      colorScheme={colorScheme}
      textTransform="unset"
      padding="5px 12px"
      borderRadius={16}
    >
      {swapStatusText(swapStatus)}
    </Badge>
  );
};
