import { useCallback } from "react";
import moment from "moment";
import { ChevronRight } from "react-feather";
import BN from "bignumber.js";
import { Order, OrderType as IOrderType } from "@orbs-network/twap-sdk";
import { parseOrderType } from "../utils";
import { colors } from "@/consts";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { OrderStatusBadge } from "./components";
import { usePaginatedTwapOrders } from "@/lib/twap/queries";
import { VirtualTable } from "@/components/virtual-table";
import { useNetwork } from "@/hooks/hooks";
import { PartnerConfigs } from "./partner-configs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTwapPartnerByExchange } from "@/hooks/twap-hooks";
import { useFormatNumber } from "@/hooks/use-number-format";
import { TokenAddress } from "@/components/Address";
import { navigation } from "@/router";
import { abbreviate } from "@/lib/utils";
import _ from "lodash";

const GoButton = ({ item }: { item: Order }) => {
  const navigate = useNavigate();
  const onNavigate = useCallback(() => {
    navigate(navigation.twap.order(item));
  }, [navigate, item]);

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
const Timestamp = ({ item }: { item: Order }) => {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger>
          <p>{moment(item.createdAt).fromNow()}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {moment(item.createdAt).format("lll")} -{" "}
            {moment(item.deadline).format("lll")}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const TradeUSDValue = ({ item }: { item: Order }) => {
  const value = item.tradeDollarValueIn;
  const amountF = abbreviate(value || 0, 2);

  return <>{BN(value || 0).gt(0) ? <p>{`$${amountF}`}</p> : <p>-</p>}</>;
};

const PriceImpact = ({ item }: { item: Order }) => {
  const tradeDollarValueIn = item.filledDollarValueIn;
  const tradeDollarValueOut = item.filledDollarValueOut;

  const priceImpact = BN(tradeDollarValueIn)
    .minus(tradeDollarValueOut)
    .div(tradeDollarValueIn)
    .multipliedBy(100)
    .toNumber();
  const priceImpactF = useFormatNumber({
    value: priceImpact,
  });

  if (BN(tradeDollarValueIn).lte(0) || BN(tradeDollarValueOut).lte(0)) {
    return <p>-</p>;
  }

  return <p>{`${priceImpactF}%`}</p>;
};

const Tokens = ({ item }: { item: Order }) => {
  const { srcTokenAddress, dstTokenAddress, srcTokenSymbol, dstTokenSymbol } =
    item;

  return (
    <div className="flex flex-row gap-2 items-center">
      <TokenAddress
        chainId={item.chainId}
        address={srcTokenAddress}
        symbol={srcTokenSymbol}
      />

      <ChevronRight size={10} style={{ color: colors.dark.textMain }} />

      <TokenAddress
        chainId={item.chainId}
        address={dstTokenAddress}
        symbol={dstTokenSymbol}
      />
    </div>
  );
};

const OrderId = ({ item }: { item: Order }) => {
  return <p>{`#${item.id.toString()}`}</p>;
};

const Status = ({ item }: { item: Order }) => {
  const { chunks, fills } = item;
  return (
    <Tooltip>
      <TooltipTrigger>
        <OrderStatusBadge order={item} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-row gap-2 items-center">
          <p>
            Filled {fills?.length}/{chunks}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const OrderType = ({ item }: { item: Order }) => {
  return <p>{parseOrderType(item.type as IOrderType)}</p>;
};

const ChainId = ({ item }: { item: Order }) => {
  const chain = useNetwork(item.chainId);
  return (
    <div className="flex flex-row gap-2 items-center">
      <Avatar className="w-5 h-5">
        <AvatarImage src={chain?.logoUrl} />
        <AvatarFallback>{chain?.shortname}</AvatarFallback>
      </Avatar>
      <p>{chain?.shortname}</p>
    </div>
  );
};

const PartnerRow = ({ item }: { item: Order }) => {
  const partner = useTwapPartnerByExchange(item.exchange, item.chainId);
  if (!partner) return null;

  return (
    <>
      <div>
        <div className="hidden sm:block">
          <PartnerConfigs partner={partner} initialChainId={item.chainId} />
        </div>
        <div className="sm:hidden flex flex-row gap-2 items-center  ">
          <Avatar className="w-5 h-5">
            <AvatarImage src={partner?.logo} />
            <AvatarFallback>{partner?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <p>{partner?.name}</p>
        </div>
      </div>
    </>
  );
};

const desktopRows = [
  {
    Component: OrderId,
    text: "ID",
  },
  {
    Component: ChainId,
    text: "Chain",
  },
  {
    Component: PartnerRow,
    text: "Partner",
  },

  {
    Component: OrderType,
    text: "Type",
  },

  {
    Component: Timestamp,
    text: "Date",
  },
  {
    Component: Tokens,
    text: "Tokens",
  },
  {
    Component: TradeUSDValue,
    text: "USD",
  },
  {
    Component: PriceImpact,
    text: "Price Impact",
  },
  {
    Component: Status,
    text: "Status",
  },
  {
    Component: GoButton,
    className: "pr-4 text-center right-0 hidden sm:block",
    text: "Action",
  },
];

const headerLabels = _.map(desktopRows, (row) => ({
  text: row.text,
}));

export function TwapOrdersTable() {
  const navigate = useNavigate();
  const { orders, isLoading, isFetchingNextPage, fetchNextPage } =
    usePaginatedTwapOrders();


    const onMobileRowClick = useCallback((item: Order) => {
      navigate(navigation.twap.order(item));
    }, [navigate]);

  return (
    <VirtualTable<Order>
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      tableItems={orders}
      headerLabels={headerLabels}
      desktopRows={desktopRows}
      onMobileRowClick={onMobileRowClick}
    />
  );
}
