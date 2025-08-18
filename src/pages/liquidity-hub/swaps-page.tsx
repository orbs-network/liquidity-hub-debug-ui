import { Link, useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import moment from "moment";
import { ChevronRight } from "react-feather";
import { useNetwork } from "@/hooks/hooks";
import _ from "lodash";
import { VirtualTable } from "@/components/virtual-table";
import { LiquidityHubSwap } from "@/lib/liquidity-hub/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LiquidityHubTransactionsFilter } from "./transactions-filter";
import { TokenAddress } from "@/components/Address";
import { useLHSwaps } from "@/lib/liquidity-hub";
import { usePartner } from "@/lib/hooks/use-partner";
import { navigation } from "@/router";
import { abbreviate, parseUserAgent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthWrapper } from "@/components/auth-wrapper";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SwapsPage = () => {
  return (
    <AuthWrapper>
      <LiquidityHubTransactionsFilter />
      <TransactionsList />
    </AuthWrapper>
  );
};

const GoButton = ({ item }: { item: LiquidityHubSwap }) => {
  const navigate = useNavigate();

  const onNavigate = useCallback(() => {
    navigate(navigation.liquidityHub.swap(item.sessionId));
  }, [navigate, item.sessionId]);

  return (
    <Button
      aria-label="Done"
      variant="ghost"
      onClick={onNavigate}
      className="rounded-full w-[40px] h-[40px] p-0"
    >
      <ChevronRight size={20} className="text-white" />
    </Button>
  );
};
const Timestamp = ({ item }: { item: LiquidityHubSwap }) => {
  return <p>{moment(item.timestamp).fromNow()}</p>;
};

const Dex = ({ item }: { item: LiquidityHubSwap }) => {
  const partner = usePartner(item.dex);
  const chain = useNetwork(item.chainId);
  return (
    <div className="flex gap-1 items-center text-sm">
      {partner?.name}
      <Avatar className="w-5 h-5 rounded-full">
        <AvatarImage src={chain?.logoUrl} />
      </Avatar>
    </div>
  );
};

const Tokens = ({ item }: { item: LiquidityHubSwap }) => {
  const {
    tokenInAddress,
    chainId,
    tokenOutAddress,
    tokenInSymbol,
    tokenOutSymbol,
  } = item;

  return (
    <div className="flex gap-1 items-center text-sm">
      <TokenAddress
        address={tokenInAddress}
        chainId={chainId}
        symbol={tokenInSymbol}
      />
      <ChevronRight size={10} />
      <TokenAddress
        address={tokenOutAddress}
        chainId={chainId}
        symbol={tokenOutSymbol}
      />
    </div>
  );
};

const SessionId = ({ item }: { item: LiquidityHubSwap }) => {
  return (
    <Link
      to={navigation.liquidityHub.swap(item.sessionId)}
      style={{ textDecoration: "unset" }}
    >
      {item.sessionId}
    </Link>
  );
};

const Usd = ({ item }: { item: LiquidityHubSwap }) => {
  const { amountInUSD } = item;

  return amountInUSD ? `$${abbreviate(amountInUSD.toString())}` : "-";
};

const FeesUsd = ({ item }: { item: LiquidityHubSwap }) => {
  const { feeOutAmountUsd } = item;

  return feeOutAmountUsd ? `$${abbreviate(feeOutAmountUsd.toString())}` : "-";
};
const Status = ({ item }: { item: LiquidityHubSwap }) => {
  return <StatusBadge swapStatus={item.swapStatus} />;
};

const Agent = ({ item }: { item: LiquidityHubSwap }) => {
  const result = useMemo(
    () => parseUserAgent(item.userAgent || item.ua),
    [item.userAgent, item.ua]
  );
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p>{!result ? "-" : result.wallet || result.os}</p>
        </TooltipTrigger>
        {result && (
          <TooltipContent>
            <p>Browser: {result.browser}</p>
            <p>OS: {result.os}</p>
            <p>Device: {result.device}</p>
            <p>Wallet: {result.wallet}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const desktopRows = [
  {
    Component: Dex,
    text: "Dex",
  },
  {
    Component: SessionId,
    text: "Session id",
  },
  {
    Component: Timestamp,
    text: "Time",
  },
  {
    Component: Tokens,
    text: "Tokens",
  },
  {
    Component: Usd,
    text: "USD",
  },
  {
    Component: FeesUsd,
    text: "Fees",
  },
  {
    Component: Status,
    text: "Status",
  },
  {
    Component: Agent,
    text: "Agent",
  },

  {
    Component: GoButton,
    text: "Action",
    className: "pr-4 text-center hidden sm:block",
  },
];

const headerLabels = _.map(desktopRows, (row) => ({
  text: row.text,
}));

export const TransactionsList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } = useLHSwaps();
  const navigate = useNavigate();
  const sessions = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  const onMobileRowClick = useCallback(
    (item: LiquidityHubSwap) => {
      navigate(navigation.liquidityHub.swap(item.sessionId));
    },
    [navigate]
  );

  return (
    <VirtualTable<LiquidityHubSwap>
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      tableItems={sessions}
      headerLabels={headerLabels}
      desktopRows={desktopRows}
      onMobileRowClick={onMobileRowClick}
    />
  );
};
