
import { useExplorerUrl } from "@/hooks";
import { cn } from "@/lib/utils";
import { shortenAddress } from "@/utils";

export function Address({
  address,
  chainId,
  type = "address",
  className,
}: {
  address?: string;
  chainId?: number;
  type?: "address" | "tx";
  className?: string;
}) {
  const explorer = useExplorerUrl(chainId);

  return (
    <a
      href={`${explorer}/${type}/${address}`}
      target="_blank"
      className={cn("text-sm  hover:underline", className)}
    >
      {shortenAddress(address || "", 6)}
    </a>
  );
}
