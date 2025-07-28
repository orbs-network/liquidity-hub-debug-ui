import { useNetwork } from "@/hooks/hooks";
import { cn } from "@/lib/utils";
import { shortenAddress } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Copy } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";

export function Address({
  address,
  chainId,
  type = "address",
  className,
  children,
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
  symbol,
}: {
  chainId?: number;
  address?: string;
  symbol?: string;
}) => {
  const copy = useCopy();
  const explorer = useNetwork(chainId)?.explorer;
  return (
    <Tooltip>
      <TooltipTrigger>
        <a
          href={`${explorer}/address/${address}`}
          target="_blank"
          className="text-sm hover:underline"
        >
          <p>{symbol}</p>
        </a>
      </TooltipTrigger>
      <TooltipContent className="flex flex-row gap-2">
        <p className="text-[15px] font-mono">{address}</p>
        <Copy
          className="w-4 h-4 cursor-pointer"
          onClick={() => copy(address || "")}
        />
      </TooltipContent>
    </Tooltip>
  );
};
