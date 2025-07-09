import styled from "styled-components";
import TextOverflow from "react-text-overflow";
import { useCallback } from "react";
import moment from "moment";
import { Button, Typography, Avatar } from "antd";
import { ChevronRight } from "react-feather";
import { RowFlex } from "@/styles";
import { DataDisplay, List, TokenAddress } from "@/components";
import BN from "bignumber.js";
import {
  useNumberFormatter,
  useNavigateWithParams,
  useToken,
  useAmountUI,
} from "@/hooks";
import { Order, OrderType as IOrderType } from "@orbs-network/twap-sdk";
import { parseOrderType } from "../utils";
import { colors } from "@/consts";
import { navigation } from "@/utils";
import {
  useTwapConfigByExchange,
  useTwapPartnerByExchange,
} from "@/hooks/twap-hooks";

export const StyledRow = styled(RowFlex)`
  text-align: left;
  padding-right: 0px;
`;

export const TwapOrdersList = ({
  orders = [],
  loadMore,
  isFetchingNextPage,
  isLoading,
}: {
  orders?: Order[];
  loadMore: () => void;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <List<Order>
      headerLabels={headerLabels}
      isLoading={isLoading}
      items={orders}
      loadMore={loadMore}
      isFetchingNextPage={isFetchingNextPage}
      DesktopComponent={DesktopComponent}
      MobileComponent={MobileComponent}
    />
  );
};

const DesktopComponent = ({ item }: { item: Order }) => {
  return (
    <List.DesktopRow>
      {desktopRows.map((it) => {
        return (
          <List.DesktopRow.Element
            key={it.label}
            alignCenter={it.alignCenter}
            width={it.width}
          >
            <it.Component order={item} />
          </List.DesktopRow.Element>
        );
      })}
    </List.DesktopRow>
  );
};

const GoButton = ({ order }: { order: Order }) => {
  const navigate = useNavigateWithParams();
  const onNavigate = useCallback(() => {
    navigate(navigation.twap.order(order.id.toString()));
  }, [order.id, navigate]);

  return (
    <StyledButtons>
      <Button
        aria-label="Done"
        style={{
          backgroundColor: "#f8f9fb",
          color: "#4a5568",
          border: "1px solid #e2e8f0",
          borderRadius: "50%",
        }}
        icon={<ChevronRight size={20} />}
        onClick={onNavigate}
      />
    </StyledButtons>
  );
};
const Timestamp = ({ order }: { order: Order }) => {
  return (
    <StyledItem>
      <RowText text={moment(order.createdAt).fromNow()} />
    </StyledItem>
  );
};

const Dex = ({ order }: { order: Order }) => {
  const partner = useTwapPartnerByExchange(order.exchange, order.chainId);
  return (
    <StyledItem>
      <Avatar src={partner?.logoUrl} size={25} />
      <RowText text={partner?.name} />
    </StyledItem>
  );
};

const TradeAmount = ({ order }: { order: Order }) => {
  const amount = useNumberFormatter({
    value: order.tradeDollarValueIn,
  }).short;

  return (
    <StyledItem>
      {BN(amount || 0).gt(0) ? (
        <RowText text={`$${amount}`} />
      ) : (
        <RowText text="-" />
      )}
    </StyledItem>
  );
};

const DexFee = ({ order }: { order: Order }) => {
  return (
    <StyledItem>
      {BN(order.filledFee || 0).gt(0) ? (
        <DexFeeAmount order={order} />
      ) : (
        <RowText text="-" />
      )}
    </StyledItem>
  );
};
const DexFeeAmount = ({ order }: { order: Order }) => {
  const config = useTwapConfigByExchange(order.exchange, order.chainId);
  const { data: token } = useToken(order.dstTokenAddress, order.chainId);
  const amount = useAmountUI(token?.decimals, order.filledFee);

  return (
    <DataDisplay.TokenAmount
      amount={amount}
      address={order.dstTokenAddress}
      chainId={config?.chainId}
    />
  );
};

const Tokens = ({ order }: { order: Order }) => {
  const { srcTokenSymbol, dstTokenSymbol, srcTokenAddress, dstTokenAddress } =
    order;

  return (
    <StyledTokens $gap={2}>
      <TokenAddress
        chainId={order.chainId}
        address={srcTokenAddress}
        symbol={srcTokenSymbol}
      />

      <ChevronRight size={10} style={{ color: colors.dark.textMain }} />

      <TokenAddress
        symbol={dstTokenSymbol}
        chainId={order.chainId}
        address={dstTokenAddress}
      />
    </StyledTokens>
  );
};

const StyledTokens = styled(StyledRow)({
  fontSize: 13,
  "*": {
    fontWeight: 400,
  },
});

const OrderId = ({ order }: { order: Order }) => {
  return (
    <StyledRow>
      <RowText text={`#${order.id.toString()}`} />
    </StyledRow>
  );
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
`;

const StyledText = styled(Typography)`
  font-size: 13px;
  * {
    color: ${colors.dark.textMain};
  }
`;

const StyledButtons = styled(RowFlex)`
  justify-content: flex-end;
  width: 100%;
`;

export const StatusBadge = ({ status }: { status?: string }) => {
  return (
    <Container style={{ background: "#F0AD4E" }}>
      <Typography style={{ textTransform: "capitalize" }}>
        <TextOverflow text={status || ""} />
      </Typography>
    </Container>
  );
};

const Container = styled("div")({
  padding: "4px 10px",
  borderRadius: 16,
  span: {
    color: "white",
    fontSize: 12,
  },
});

const Status = ({ order }: { order: Order }) => {
  return (
    <StyledItem>
      <StatusBadge status={order.status} />
    </StyledItem>
  );
};

const OrderType = ({ order }: { order: Order }) => {
  return (
    <StyledItem>
      <RowText text={parseOrderType(order.type as IOrderType)} />
    </StyledItem>
  );
};

const desktopRows = [
  {
    Component: OrderId,
    label: "ID",
    width: 10,
  },
  {
    Component: Dex,
    label: "Partner",
    width: 15,
  },
 

  {
    Component: OrderType,
    label: "Type",
    width: 10,
  },

  {
    Component: Timestamp,
    label: "Date",
    width: 15,
  },
  {
    Component: Tokens,
    label: "Tokens",
    width: 14,
  },
  {
    Component: TradeAmount,
    label: "$ Value",
    width: 12,
  },
  {
    Component: DexFee,
    label: "Fee",
    width: 14,
  },
  {
    Component: Status,
    label: "Status",
    width: 10,
    alignCenter: true,
  },
  {
    Component: GoButton,
    label: "Action",
    width: 5,
    alignCenter: true,
  },
];

const MobileComponent = ({ item: order }: { item: Order }) => {
  const config = useTwapConfigByExchange(order.exchange, order.chainId);
  const { data: srcToken } = useToken(order.srcTokenAddress, order.chainId);
  const { data: dstToken } = useToken(order.dstTokenAddress, order.chainId);
  const navigate = useNavigateWithParams();
  const onClick = useCallback(() => {
    navigate(navigation.twap.order(order.id.toString()));
  }, [navigate, order.id]);

  return (
    <MobileContainer onClick={onClick}>
      <List.MobileRow
        partner={config?.name}
        chainId={config?.chainId}
        inToken={srcToken?.symbol}
        outToken={dstToken?.symbol}
        timestamp={order.createdAt}
        status={order.status}
        statusColor={"#F0AD4E"}
      />
    </MobileContainer>
  );
};

const MobileContainer = styled("div")({
  padding: "8px 0px",
  width: "100%",
});

const headerLabels = desktopRows.map((it) => {
  return {
    label: it.label,
    width: it.width,
    alignCenter: it.alignCenter,
  };
});
