import styled from "styled-components";
import TextOverflow from "react-text-overflow";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import { createContext, useCallback, useContext } from "react";
import { Virtuoso } from "react-virtuoso";
import moment from "moment";
import { Button, Typography, Spin, Skeleton, Avatar } from "antd";
import { ChevronRight } from "react-feather";
import { RowFlex } from "styles";
import { AddressLink } from "components";
import {
  useToken,
  useAppParams,
  useAmountUI,
  useNumberFormatter,
  useTwapPartner,
} from "hooks";
import { Order, OrderStatus } from "@orbs-network/twap-sdk";
import { parseOrderType } from "../utils";
import { ROUTES } from "config";

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
  const noLoadMore = useCallback(() => {
    if (isFetchingNextPage) return;
    loadMore();
  }, [loadMore, isFetchingNextPage]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (_.isEmpty(orders)) {
    return <StyledEmpty>No orders found</StyledEmpty>;
  }

  const totalCount = isFetchingNextPage ? _.size(orders) + 1 : _.size(orders);

  return (
    <StyledList>
      <ListHeader />
      <Virtuoso
        endReached={noLoadMore}
        useWindowScroll
        totalCount={totalCount}
        overscan={10}
        itemContent={(index) => {
          const order = orders[index];
          return <ListOrder order={order} isLast={index + 1 === totalCount} />;
        }}
      />
    </StyledList>
  );
};

const StyledEmpty = styled.div`
  padding: 20px;
`;

const StyledLoaderContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
  height: 100px;
`;

interface ContextProps {
  order: Order;
  chainId: number;
}

const Context = createContext({} as ContextProps);
const useOrderContext = () => {
  return useContext(Context);
};

const GoButton = () => {
  const { order } = useOrderContext();
  const navigate = useNavigate();
  const location = useLocation()
  const onNavigate = () => {    
    navigate(ROUTES.navigate.twap.order(order.id, location.search));
  };

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
const Timestamp = () => {
  const { order } = useOrderContext();
  return (
    <StyledItem>
      <RowText text={moment(order.createdAt).format("MMM D, h:mm A")} />
    </StyledItem>
  );
};

const Dex = () => {
  const { order } = useOrderContext();
  const partner = useTwapPartner(order.exchange);
  return (
    <StyledItem>
      <Avatar src={partner?.logoUrl} size={25} />
      <RowText text={partner?.name} />
    </StyledItem>
  );
};

const TradeAmount = () => {
  const { order, chainId } = useOrderContext();
  const token = useToken(order.srcTokenAddress, chainId);
  const amount = useNumberFormatter({
    value: useAmountUI(token?.decimals, order.srcAmount),
    format: true,
  });
  return (
    <StyledItem>
      <RowText text={` ${amount} ${token?.symbol || ""}`} />
    </StyledItem>
  );
};

const Tokens = () => {
  const { order, chainId } = useOrderContext();
  const { srcTokenAddress, dstTokenAddress } = order;
  const inToken = useToken(srcTokenAddress, chainId);
  const outToken = useToken(dstTokenAddress, chainId);

  return (
    <StyledTokens $gap={2}>
      {!inToken ? (
        <Skeleton.Avatar size={25} />
      ) : (
        <AddressLink
          path="address"
          chainId={chainId}
          text={inToken?.symbol}
          address={srcTokenAddress}
        />
      )}

      <ChevronRight size={10} />

      {!outToken ? (
        <Skeleton.Avatar size={25} />
      ) : (
        <AddressLink
          path="address"
          chainId={chainId}
          text={outToken?.symbol}
          address={dstTokenAddress}
        />
      )}
    </StyledTokens>
  );
};

const StyledTokens = styled(StyledRow)({
  fontSize: 13,
  "*": {
    fontWeight: 400,
  },
});

const OrderId = () => {
  const { order } = useOrderContext();

  return (
    <StyledRow>
      <Link to="/" style={{ textDecoration: "unset" }}>
        <RowText text={order.id.toString()} />
      </Link>
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
`;

const StyledButtons = styled(RowFlex)`
  justify-content: flex-end;
  width: 100%;
`;

const ListOrderContainer = styled(RowFlex)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 15px;
  gap: 0px;
  position: relative;
  border-bottom: 1px solid #f1f3fe;
`;

const StyledHeader = styled(RowFlex)`
  justify-content: flex-start;
  padding: 0px 15px;
  height: 50px;
  gap: 0px;
  font-weight: 500;
  background: #f1f3fe;
  border-radius: 6px;
`;

const StyledHeaderItem = styled(Typography)({
  fontSize: 14,
  textAlign: "left",
  paddingRight: 20,
  fontWeight: 600,
  "&:last-child": {
    textAlign: "center",
    paddingRight: 0,
  },
});

const StyledList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const StatusBadge = ({ status }: { status?: OrderStatus }) => {
  return (
    <Container style={{ background: "#F0AD4E" }}>
      <Typography>
        <span style={{ textTransform: "capitalize" }}>{status}</span>
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

const Status = () => {
  const { order } = useOrderContext();
  return (
    <StyledItem>
      <StatusBadge status={order.status} />
    </StyledItem>
  );
};

const OrderType = () => {
  const { order } = useOrderContext();

  return (
    <StyledItem>
      <RowText text={parseOrderType(order.orderType)} />
    </StyledItem>
  );
};

const ListHeader = () => {
  return (
    <StyledHeader>
      {_.map(items, (item, index) => {
        return (
          <StyledHeaderItem
            key={index}
            style={{
              width: `${item.width}%`,
              textAlign: item.alignCenter ? "center" : "left",
            }}
          >
            {item.label}
          </StyledHeaderItem>
        );
      })}
    </StyledHeader>
  );
};

export const ListOrder = ({
  order,
  isLast,
}: {
  order: Order;
  isLast: boolean;
}) => {
  const {
    query: { chainId },
  } = useAppParams();
  if (!order) {
    return (
      <StyledLoaderContainer>
        <Spin />
      </StyledLoaderContainer>
    );
  }

  return (
    <Context.Provider value={{ order, chainId: chainId || 1 }}>
      <ListOrderContainer style={{ borderBottom: isLast ? "unset" : "" }}>
        {items.map((item, index) => {
          return (
            <StyledListComponent
              key={index}
              style={{
                width: `${item.width}%`,
                justifyContent: item.alignCenter ? "center" : "flex-start",
              }}
            >
              {item.component}
            </StyledListComponent>
          );
        })}
      </ListOrderContainer>
    </Context.Provider>
  );
};

const StyledListComponent = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  textAlign: "left",
  paddingRight: 20,
  "&:last-child": {
    paddingRight: 10,
  },
});

const items = [
  {
    component: <OrderId />,
    label: "ID",
    width: 10,
  },
  {
    component: <Dex />,
    label: "Dex",
    width: 15,
  },

  {
    component: <OrderType />,
    label: "Type",
    width: 10,
  },

  {
    component: <Timestamp />,
    label: "Date",
    width: 15,
  },
  {
    component: <Tokens />,
    label: "Tokens",
    width: 20,
  },
  {
    component: <TradeAmount />,
    label: "Trade amount",
    width: 15,
  },
  {
    component: <Status />,
    label: "Status",
    width: 10,
    alignCenter: true,
  },
  {
    component: <GoButton />,
    label: "Action",
    width: 5,
    alignCenter: true,
  },
];
