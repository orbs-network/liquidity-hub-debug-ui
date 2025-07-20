import styled from "styled-components";
import TextOverflow from "react-text-overflow";
import { useCallback } from "react";
import moment from "moment";
import { Typography } from "antd";
import { ChevronRight } from "react-feather";
import { RowFlex } from "@/styles";
import { TokenAddress } from "@/components";
import BN from "bignumber.js";
import { useNumberFormatter } from "@/hooks";
import { Order, OrderType as IOrderType } from "@orbs-network/twap-sdk";
import { parseOrderType } from "../utils";
import { colors } from "@/consts";
import { navigation } from "@/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { OrderStatusBadge } from "./components";
import { usePaginatedTwapOrders } from "@/lib/queries/use-twap-orders-query";
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

export const StyledRow = styled(RowFlex)`
  text-align: left;
  padding-right: 0px;
`;

const HEADER_LABELS = [
  {
    text: "ID",
  },
  {
    text: "Chain",
  },
  {
    text: "Partner",
  },
  {
    text: "Type",
  },
  {
    text: "Date",
  },
  {
    text: "Tokens",
  },
  {
    text: "USD",
  },
  {
    text: "Price Impact",
  },
  {
    text: "Status",
  },
  {
    text: "Actions",
  },
];

export function TwapOrdersTable() {
  const { orders, isLoading, isFetchingNextPage, fetchNextPage } =
    usePaginatedTwapOrders();

  return (
    <VirtualTable<Order>
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      tableItems={orders}
      headerLabels={HEADER_LABELS}
      desktopRows={desktopRows}
    />
  );
}

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
  const amountF = useNumberFormatter({
    value,
  }).short;

  return (
    <StyledItem>
      {BN(value || 0).gt(0) ? (
        <RowText text={`$${amountF}`} />
      ) : (
        <RowText text="-" />
      )}
    </StyledItem>
  );
};

const PriceImpact = ({ item }: { item: Order }) => {
  const tradeDollarValueIn = item.filledDollarValueIn;
  const tradeDollarValueOut = item.filledDollarValueOut;

  const priceImpact = BN(tradeDollarValueIn)
    .minus(tradeDollarValueOut)
    .div(tradeDollarValueIn)
    .multipliedBy(100)
    .toNumber();
  const priceImpactF = useNumberFormatter({
    value: priceImpact,
  }).short;

  if (BN(tradeDollarValueIn).lte(0) || BN(tradeDollarValueOut).lte(0)) {
    return <RowText text="-" />;
  }

  return (
    <StyledItem>
      <RowText text={`${priceImpactF}%`} />
    </StyledItem>
  );
};

const Tokens = ({ item }: { item: Order }) => {
  const { srcTokenSymbol, dstTokenSymbol, srcTokenAddress, dstTokenAddress } =
    item;

  return (
    <StyledTokens $gap={2}>
      <TokenAddress
        chainId={item.chainId}
        address={srcTokenAddress}
        symbol={srcTokenSymbol}
      />

      <ChevronRight size={10} style={{ color: colors.dark.textMain }} />

      <TokenAddress
        symbol={dstTokenSymbol}
        chainId={item.chainId}
        address={dstTokenAddress}
      />
    </StyledTokens>
  );
};

const StyledTokens = styled(StyledRow)({
  fontSize: 13,
  justifyContent: "flex-start",
  "*": {
    fontWeight: 400,
  },
});

const OrderId = ({ item }: { item: Order }) => {
  return <RowText text={`#${item.id.toString()}`} />;
};

const RowText = ({ text = "-" }: { text?: string }) => {
  return (
    <StyledText>
      <TextOverflow text={text} />
    </StyledText>
  );
};

const StyledItem = styled(StyledRow)`
  gap: 5px;
  justify-content: flex-start;
`;

const StyledText = styled(Typography)`
  font-size: 13px;
  * {
    color: ${colors.dark.textMain};
  }
`;

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
  return (
    <StyledItem>
      <RowText text={parseOrderType(item.type as IOrderType)} />
    </StyledItem>
  );
};

const ChainId = ({ item }: { item: Order }) => {
  const chain = useNetwork(item.chainId);
  return (
    <StyledItem>
      <Avatar className="w-5 h-5">
        <AvatarImage src={chain?.logoUrl} />
        <AvatarFallback>{chain?.shortname}</AvatarFallback>
      </Avatar>
      <RowText text={chain?.shortname} />
    </StyledItem>
  );
};

const PartnerRow = ({ item }: { item: Order }) => {
  const partner = useTwapPartnerByExchange(item.exchange, item.chainId);
  if (!partner) return null;

  return <PartnerConfigs partner={partner} initialChainId={item.chainId} />;
};

const desktopRows = [
  {
    Component: OrderId,
  },
  {
    Component: ChainId,
  },
  {
    Component: PartnerRow,
  },

  {
    Component: OrderType,
  },

  {
    Component: Timestamp,
  },
  {
    Component: Tokens,
  },
  {
    Component: TradeUSDValue,
  },
  {
    Component: PriceImpact,
  },
  {
    Component: Status,
  },
  {
    Component: GoButton,
    className: "w-[100px] pr-4 text-center",
  },
];
