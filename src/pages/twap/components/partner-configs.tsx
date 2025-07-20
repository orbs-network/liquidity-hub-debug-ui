import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePartnerConfigs } from "@/hooks/twap-hooks";
import { Config, Partner } from "@/types";
import { ReactNode, useMemo } from "react";
import { useNetwork } from "@/hooks/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Address } from "@/components/Address";
import { cn } from "@/lib/utils";
import { getNetworkByChainId } from "@/utils";

export const PartnerConfigs = ({
  partner,
  initialChainId,
  trigger,
}: {
  partner: Partner;
  initialChainId?: number;
  trigger?: ReactNode;
}) => {
  const [selected, setSelected] = useState<Config | undefined>(undefined);
  const configs = usePartnerConfigs(partner);

  const selectedItem = useMemo(
    () => selected || configs?.find((it) => it.chainId === initialChainId),
    [configs, initialChainId, selected]
  );

  const currentChain = useNetwork(selectedItem?.chainId);

  return (
    <Dialog>
      <DialogTrigger>
        {trigger ? (
          trigger
        ) : (
          <Button
            className="flex items-center gap-2 hover:bg-slate-900/50"
            variant="ghost"
          >
            <Avatar className="w-5 h-5">
              <AvatarImage src={partner?.logo} />
              <AvatarFallback>{partner?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <p>{partner?.name}</p>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="md:max-w-[600px] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{partner?.name}</DialogTitle>
        </DialogHeader>
        {configs && configs.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-[14px]"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={currentChain?.logoUrl} />
                    <AvatarFallback>{currentChain?.shortname.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p>{currentChain?.shortname}</p>
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {configs
                ?.filter((it) => it.chainId !== currentChain?.id)
                .map((config, index) => {
                  const chain = getNetworkByChainId(config.chainId);
                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        setSelected(config);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={chain?.logoUrl} />
                          <AvatarFallback>{chain?.shortname}</AvatarFallback>
                        </Avatar>
                        <p>{chain?.name}</p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ConfigDetails config={selectedItem} />
      </DialogContent>
    </Dialog>
  );
};

const ConfigDetailsAddresses = ({
  addresses,
  chainId,
}: {
  addresses: string[];
  chainId: number;
}) => {
  return (
    <div className="flex items-center w-full justify-end">
      {addresses.length > 0
        ? addresses.map((it, index) => {
            return (
              <>
                <Address key={it} address={it} chainId={chainId} />
                {index < addresses.length - 1 && <span>,</span>}
              </>
            );
          })
        : "-"}
    </div>
  );
};
const ConfigDetails = ({ config }: { config?: Config }) => {
  if (!config) return null;

  return (
    <div className="bg-card rounded-lg p-4 w-full flex flex-col gap-2">
      <Detail label="Bid Delay Seconds" value={config.bidDelaySeconds} />
      <Detail
        label="chain"
        value={
          <>
            <span>
              {config.chainName}{" "}
              <small className="text-xs text-secondary-foreground font-mono">
                ({config.chainId})
              </small>
            </span>
          </>
        }
      />
      <Detail
        label="Exchange Address"
        value={
          <Address address={config.exchangeAddress} chainId={config.chainId} />
        }
      />
      <Detail
        label="Legacy Exchange Addresses"
        value={
          <ConfigDetailsAddresses
            addresses={config.legacyExchanges}
            chainId={config.chainId}
          />
        }
      />
      <Detail label="exchangeType" value={config.exchangeType} />
      <Detail
        label="Lens address"
        value={
          <Address address={config.lensAddress} chainId={config.chainId} />
        }
      />
      <Detail label="Min Chunk Size Usd" value={config.minChunkSizeUsd} />
      <Detail label="Name" value={config.name} />
      <Detail label="Partner" value={config.partner} />
      <Detail label="pathfinderKey" value={config.pathfinderKey} />
      <Detail
        label="Takers"
        value={
          <ConfigDetailsAddresses
            addresses={config.takers}
            chainId={config.chainId}
          />
        }
      />
      <Detail
        label="Twap address"
        value={
          <Address address={config.twapAddress} chainId={config.chainId} />
        }
      />
      <Detail label="Twap Version" value={config.twapVersion} />
    </div>
  );
};

const Detail = ({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center  w-full flex-wrap justify-between text-white gap-[10px] text-sm font-medium font-mono",
        className
      )}
    >
      <p>{label}</p>
      {value || "-"}
    </div>
  );
};
