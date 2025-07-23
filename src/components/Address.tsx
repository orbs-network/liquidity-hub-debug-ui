import { useNetwork } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { shortenAddress } from "@/lib/utils";

export function Address({
  address,
  chainId,
  type = "address",
  className,
  children
}: {
  address?: string;
  chainId: number;
  type?: "address" | "tx";
  className?: string;
  children?: React.ReactNode;
}) {
  const explorer = useNetwork(chainId)?.explorer;


  return (
    <a
      href={`${explorer}/${type}/${address}`}
      target="_blank"
      className={cn("text-sm  hover:underline font-mono", className)}
    >
      {children || shortenAddress(address || "", 6)}
    </a>
  );
}


export const TokenAddress = ({
  chainId,
  address,
  symbol
}: {
  chainId?: number;
  address?: string;
  symbol?: string;
}) => {
  const explorer = useNetwork(chainId)?.explorer;
  return (
    <a href={`${explorer}/address/${address}`} target="_blank" className="text-sm hover:underline">
      <p>{symbol}</p>
    </a>
  );
};
