import { ReactNode, useMemo, useState } from "react";
import {
  useDexSwapsCountByStatus,
  useFailedSwaps,
  useLHDexFees,
  useLHDexVolume,
  useLHTotalFees,
  useLHTotalSwaps,
  useLHTotalSwapsVolume,
  useLHTotalUniqueSwappers,
} from "@/lib/liquidity-hub/queries";
import { useSetInitialTimestampFilter } from "@/lib/hooks/use-query-filter-params";
import moment from "moment";
import { Partner } from "@/lib/types";
import { Card } from "@/components/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNetwork } from "@/hooks/hooks";
import { abbreviate } from "@/lib/utils";
import { DateSelector } from "@/components/date-selector";
import { OverviewHeader } from "@/components/overview-header";
import { ChartArea } from "lucide-react";
import { PARTNERS } from "@/partners";
import { Skeleton } from "@/components/ui/skeleton";
import { LiquidityHubSwap } from "@/lib/liquidity-hub";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Virtuoso } from "react-virtuoso";
import { LogDisplay } from "@/components/log-display";
import { AuthWrapper } from "@/components/auth-wrapper";

const useIntegrations = () => {
  const { data: fees } = useLHDexFees();

  return useMemo(() => {
    if (!PARTNERS) return [];

    const volumeMap = new Map<string, number>();
    fees?.forEach(({ partnerId, chainId, value }) => {
      volumeMap.set(`${partnerId}_${chainId}`, value ?? 0);
    });

    const integrations = PARTNERS.flatMap((partner) =>
      partner.liquidityHubChains.map((chainId) => ({
        partner,
        chainId,
      }))
    );

    return integrations.sort((a, b) => {
      const aKey = `${a.partner.liquidityHubID}_${a.chainId}`;
      const bKey = `${b.partner.liquidityHubID}_${b.chainId}`;
      const aVolume = volumeMap.get(aKey) ?? 0;
      const bVolume = volumeMap.get(bKey) ?? 0;
      return bVolume - aVolume;
    });
  }, [fees]);
};

export function OverviewPage() {
  useSetInitialTimestampFilter(moment.duration(1, "day").asMilliseconds());
  const integrations = useIntegrations();
  
  return (
    <AuthWrapper>
      <div className="flex flex-col gap-4">
      <div className="ml-auto">
        <DateSelector />
      </div>
      <TotalOverview />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4 ">
        {integrations.map((it) => {
          return (
            <Integration
              key={`${it.partner.liquidityHubID}-${it.chainId}`}
              partner={it.partner}
              chainId={it.chainId}
            />
          );
        })}
      </div>
    </div>
    </AuthWrapper>
  );
}

const TotalOverview = () => {
  const { data: totalSwapsVolume, isLoading: isLoadingTotalSwapsVolume } =
    useLHTotalSwapsVolume();
  const { data: totalFees, isLoading: isLoadingTotalFees } = useLHTotalFees();
  const { data: totalSwap, isLoading: isLoadingTotalSwap } = useLHTotalSwaps();
  const { data: totalUniqueSwappers, isLoading: isLoadingTotalUniqueSwappers } =
    useLHTotalUniqueSwappers();

  return (
    <OverviewHeader>
      <OverviewHeader.Item
        isLoading={isLoadingTotalSwapsVolume}
        title="Total Volume"
        value={`$${abbreviate(totalSwapsVolume)}`}
        icon={<ChartArea />}
      />
      <OverviewHeader.Item
        isLoading={isLoadingTotalFees}
        title="Total Fees"
        value={`$${abbreviate(totalFees)}`}
        icon={<ChartArea />}
      />
      <OverviewHeader.Item
        isLoading={isLoadingTotalSwap}
        title="Total Swaps"
        value={abbreviate(totalSwap)}
        icon={<ChartArea />}
      />
      <OverviewHeader.Item
        isLoading={isLoadingTotalUniqueSwappers}
        title="Unique Swappers"
        value={abbreviate(totalUniqueSwappers)}
        icon={<ChartArea />}
      />
    </OverviewHeader>
  );
};

const Integration = ({
  partner,
  chainId,
}: {
  partner: Partner;
  chainId: number;
}) => {
  const { data: feesData, isLoading: isLoadingFees } = useLHDexFees();
  const { data: dexVolume, isLoading: isLoadingDexVolume } = useLHDexVolume();

  
  const network = useNetwork(chainId);
    const {data: successSwapsCount, isLoading: isLoadingSuccessSwapsCount} = useDexSwapsCountByStatus(partner.liquidityHubID, chainId, "success")
    const {data: allFailedSwaps, isLoading: isLoadingFailedSwaps} = useFailedSwaps()

  const failedSwaps = useMemo(() => {
    return allFailedSwaps?.[partner.liquidityHubID]?.[chainId] ?? []
  }, [allFailedSwaps, partner.liquidityHubID, chainId])


  const successRatePercentage = useMemo(() => {
    const result =
      (successSwapsCount /
        (successSwapsCount + failedSwaps.length)) *
      100;
    if (isNaN(result)) {
      return 0;
    }
    return parseFloat(result.toFixed(2));
  }, [successSwapsCount, failedSwaps.length]);

  const fees = useMemo(() => {
    return (
      feesData?.find(
        (fee) =>
          fee.partnerId === partner.liquidityHubID && fee.chainId === chainId
      )?.value ?? 0
    );
  }, [feesData, partner.liquidityHubID, chainId]);

  const volume = useMemo(() => {
    return (
      dexVolume?.find(
        (volume) =>
          volume.partnerId === partner.liquidityHubID &&
          volume.chainId === chainId
      )?.value ?? 0
    );
  }, [dexVolume, partner.liquidityHubID, chainId]);

  return (
    <Card>
      <Card.Header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-5">
            <AvatarImage src={partner.logo} />
          </Avatar>
          <p>{partner.name}</p>
        </div>
        <div className="bg-gray-700/40 rounded-md p-2 text-xs flex items-center gap-2">
          <p className="uppercase">{network?.shortname}</p>
          <span>({chainId})</span>
        </div>
      </Card.Header>
      <Card.Content
        className="flex flex-col gap-2"
        isLoading={isLoadingFees || isLoadingDexVolume}
      >
        <Amount amount={volume} label="Volume" isLoading={isLoadingDexVolume} />
        <Amount amount={fees} label="Fees" isLoading={isLoadingFees} />
        <Value
          children={`${successSwapsCount + failedSwaps.length}`}
          label="Total Swaps"
          isLoading={isLoadingSuccessSwapsCount || isLoadingFailedSwaps}
        />
        <Value
          children={`${successRatePercentage}%`}
          label="Success Rate"
          isLoading={isLoadingSuccessSwapsCount || isLoadingFailedSwaps}
        />
        <ErrorsModal
          swaps={failedSwaps || []}
          isLoading={isLoadingFailedSwaps}
        />
      </Card.Content>
    </Card>
  );
};

const ErrorsModal = ({
  swaps,
  isLoading,
}: {
  swaps: LiquidityHubSwap[];
  isLoading: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<LiquidityHubSwap | null>(
    null
  );

  const handleOpenChange = (open: boolean) => {
    if (selectedSwap) {
      setSelectedSwap(null);
    } else {
      setIsOpen(open);
    }
  };

  return (
    <Value label="Errors" isLoading={isLoading}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger>
          <div className="text-xs bg-gray-900/70 rounded-md px-3 py-2 cursor-pointer">
            View <span className="text-xs text-gray-400">({swaps.length})</span>
          </div>
        </DialogTrigger>
        {selectedSwap ? (
          <DialogContent className="max-h-[80vh] h-full overflow-y-auto w-full sm:max-w-[98vw] sm:max-h-[95vh]">
            <DialogHeader>
              <DialogTitle>Error - {selectedSwap.sessionId}</DialogTitle>
            </DialogHeader>
            <LogDisplay logs={selectedSwap} />
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Errors{" "}
                <span className="text-xs text-gray-400">({swaps.length})</span>
              </DialogTitle>
            </DialogHeader>
            <div className="w-full h-[70vh] max-h-[600px] overflow-y-auto">
              <Virtuoso
                className="h-full w-full"
                data={swaps}
                totalCount={swaps.length}
                itemContent={(_, swap) => {
                  return (
                    <Card
                      className="mb-2 cursor-pointer"
                      onClick={() => setSelectedSwap(swap)}
                    >
                      <Card.Content className="flex items-center justify-between md:p-2">
                        <p className="text-xs md:text-sm break-all">
                          {swap.error}
                        </p>
                      </Card.Content>
                    </Card>
                  );
                }}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </Value>
  );
};

const Value = ({
  children,
  label,
  isLoading,
}: {
  children: ReactNode;
  label: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-700/40 rounded-md p-4 text-xs">
      <p className="text-[15px]">{label}</p>
      {isLoading ? (
        <Skeleton className="w-10 h-4" />
      ) : (
        <div className="text-[16px] font-bold">{children}</div>
      )}
    </div>
  );
};

const Amount = ({
  amount,
  label,
  isLoading,
}: {
  amount: number;
  label: string;
  isLoading?: boolean;
}) => {
  return (
    <Value
      children={`$${abbreviate(amount)}`}
      label={label}
      isLoading={isLoading}
    />
  );
};
