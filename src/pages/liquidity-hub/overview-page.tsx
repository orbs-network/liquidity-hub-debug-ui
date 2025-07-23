import { useMemo } from "react";
import {
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
  useSetInitialTimestampFilter(moment.duration(7, "day").asMilliseconds());
  const integrations = useIntegrations();
  return (
    <div className="flex flex-col gap-4">
      <div className="ml-auto">
        <DateSelector buttons />
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
        <Amount amount={volume} label="Volume" />
        <Amount amount={fees} label="Fees" />
      </Card.Content>
    </Card>
  );
};

const Amount = ({ amount, label }: { amount: number; label: string }) => {
  return (
    <div className="flex items-center justify-between bg-gray-700/40 rounded-md p-4 text-xs">
      <p className="text-[15px]">{label}</p>
      <p className="text-[16px] font-bold">${abbreviate(amount)}</p>
    </div>
  );
};
