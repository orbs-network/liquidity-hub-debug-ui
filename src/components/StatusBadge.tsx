import { Check, X } from "react-feather";
import { CSSProperties } from "react";
import { swapStatusText } from "@/lib/utils";

const getBg = (swapStatus?: string) => {
  if (swapStatus === "success") return "#5CB85C";
  if (swapStatus === "failed") return "#D9534F";
  if (swapStatus === "during") return "#4ea4f0"; 
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
    <div style={{ background: getBg(swapStatus), ...style }} className={`${className} text-white flex items-center justify-center rounded-md px-2 py-1 w-fit text-xs`}>
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

