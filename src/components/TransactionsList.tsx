import styled from "styled-components";
import { RowFlex } from "../styles";
import TextOverflow from "react-text-overflow";
import { ROUTES } from "../config";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import { useChainConfig, useNumberFormatter } from "../hooks";
import { makeElipsisAddress } from "../helpers";
import { AddressLink } from "./AddressLink";
import { createContext, useCallback, useContext } from "react";
import { Virtuoso } from "react-virtuoso";
import moment from "moment";
import { SwapLog } from "types";
import { StatusBadge } from "./StatusBadge";
import { Button, Typography, Avatar, Spin, Skeleton } from "antd";
import { ChevronRight } from "react-feather";

export const StyledRow = styled(RowFlex)`
  text-align: left;
  padding-right: 0px;
`;

export const TransactionsList = ({
  sessions = [],
  loadMore,
  isFetchingNextPage,
  isLoading,
}: {
  sessions?: SwapLog[];
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

  if (_.isEmpty(sessions)) {
    return <StyledEmpty>No sessions found</StyledEmpty>;
  }

  const totalCount = isFetchingNextPage
    ? _.size(sessions) + 1
    : _.size(sessions);

  return (
    <StyledList>
      <ListHeader />
      <Virtuoso
        endReached={noLoadMore}
        useWindowScroll
        totalCount={totalCount}
        overscan={10}
        itemContent={(index) => {
          const session = sessions[index];
          return (
            <ListSession swapLog={session} isLast={index + 1 === totalCount} />
          );
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

const Context = createContext<SwapLog>(undefined as any as SwapLog);
const useSessionContext = () => {
  return useContext(Context);
};

const GoButton = () => {
  const swapLog = useSessionContext();
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(ROUTES.navigate.tx(swapLog.id));
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
  const session = useSessionContext();
  return (
    <StyledItem>
      <RowText text={moment(session.timestamp).format("MMM D, h:mm A")} />
    </StyledItem>
  );
};

const Dex = () => {
  const session = useSessionContext();
  return (
    <StyledItem>
      <RowText text={session.dex} />
    </StyledItem>
  );
};

const Tokens = () => {
  const session = useSessionContext();
  const { tokenInName, tokenOutName, tokenInAddress, chainId } = session;
  return (
    <StyledTokens $gap={2}>
      <AddressLink
        path="address"
        chainId={chainId}
        text={tokenInName}
        address={tokenInAddress}
      />
      <ChevronRight size={10} />
      <AddressLink
        path="address"
        chainId={chainId}
        text={tokenOutName}
        address={tokenInAddress}
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

const SessionId = () => {
  const session = useSessionContext();

  return (
    <StyledRow>
      <Link
        to={ROUTES.navigate.tx(session.id)}
        style={{ textDecoration: "unset" }}
      >
        <RowText text={session.id} />
      </Link>
    </StyledRow>
  );
};

const TxHash = () => {
  const session = useSessionContext();
  const { txHash } = session;
  return (
    <StyledItem>
      <StyledText>
        <Link to={ROUTES.navigate.tx(txHash)}>
        <TextOverflow text={makeElipsisAddress(txHash) || ""} /></Link>
      </StyledText>
    </StyledItem>
  );
};

const SwapStatus = () => {
  const session = useSessionContext();

  return (
    <StyledItem>
      <StatusBadge swapStatus={session.swapStatus} />
    </StyledItem>
  );
};

const Usd = () => {
  const session = useSessionContext();
  const { dollarValue } = session;
  const result = useNumberFormatter({ value: dollarValue });

  return (
    <StyledItem>
      <RowText text={result ? `$${result}` : "-"} />
    </StyledItem>
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

const ListSessionContainer = styled(RowFlex)`
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

const Network = () => {
  const session = useSessionContext();
  const chainConfig = useChainConfig(session.chainId);
  return (
    <StyledItem>
      <Avatar src={chainConfig?.logoUrl} size={23} />
      <RowText text={chainConfig?.name} />
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
            }}
          >
            {item.label}
          </StyledHeaderItem>
        );
      })}
    </StyledHeader>
  );
};

export const ListSession = ({
  swapLog,
  isLast,
}: {
  swapLog: SwapLog;
  isLast: boolean;
}) => {
  if (!swapLog) {
    return (
      <StyledLoaderContainer>
        <Spin />
      </StyledLoaderContainer>
    );
  }

  return (
    <Context.Provider value={swapLog}>
      <ListSessionContainer style={{ borderBottom: isLast ? "unset" : "" }}>
        {items.map((item, index) => {
          return (
            <StyledListComponent
              key={index}
              style={{ width: `${item.width}%` }}
            >
              {item.component}
            </StyledListComponent>
          );
        })}
      </ListSessionContainer>
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
    component: <Dex />,
    label: "Dex",
    width: 10,
  },
  {
    component: <Network />,
    label: "Network",
    width: 13,
  },
  {
    component: <SessionId />,
    label: "Session id",
    width: 11,
  },
  
  
  {
    component: <Timestamp />,
    label: "Date",
    width: 16,
  },
  {
    component: <Tokens />,
    label: "Tokens",
    width: 14,
  },
  {
    component: <Usd />,
    label: "USD",
    width: 10,
  },
  {
    component: <TxHash />,
    label: "Tx hash",
    width: 11,
  },
  {
    component: <SwapStatus />,
    label: "Status",
    width: 10,
  },
  {
    component: <GoButton />,
    label: "Action",
    width: 5,
  },
];
