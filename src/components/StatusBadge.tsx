import { Check, X } from "react-feather";
import { CSSProperties } from "react";
import { swapStatusText } from "@/lib/utils";

const getBg = (swapStatus?: string) => {
  if (swapStatus === "success") return "#55a66c";
  if (swapStatus === "failed") return "red";
  return "transparent";
};

export const StatusBadge = ({
  swapStatus,
  className = "",
  style = {}
}: {
  swapStatus?: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div style={{ color: getBg(swapStatus), ...style }} className={className}>
      {swapStatusText(swapStatus)}
    </div>
  );
};

export const MobileStatusBadge = ({
  swapStatus,
  className = "",
}: {
  swapStatus?: string;
  className?: string;
}) => {
  return (
    <div
      style={{ background: getBg(swapStatus) }}
      className={className}
    >
      {swapStatus === "success" ? (
        <Check />
      ) : swapStatus === "failed" ? (
        <X />
      ) : null}
    </div>
  );
};

