import styled from "styled-components";
import { RowFlex } from "../styles";
import TextOverflow from "react-text-overflow";
import {
  Avatar,
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ROUTES } from "../config";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { useChainConfig, useNumberFormatter } from "../hooks";
import {
  ArrowForwardIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { makeElipsisAddress } from "../helpers";
import { PageLoader } from "./PageLoader";
import { AddressLink } from "./AddressLink";
import { createContext, useCallback, useContext } from "react";
import { Virtuoso } from "react-virtuoso";
import moment from "moment";
import { SwapLog } from "types";
import { StatusBadge } from "./StatusBadge";

export const StyledRow = styled(RowFlex)`
  text-align: left;
  padding-right: 0px;
`;

export const Sessions = ({
  sessions = [],
  isLoading,
  loadMore,
  isFetchingNextPage,
}: {
  sessions?: SwapLog[];
  isLoading?: boolean;
  loadMore: () => void;
  isFetchingNextPage?: boolean;
}) => {
  const noLoadMore = useCallback(() => {
    if (isFetchingNextPage) return;
    loadMore();
  }, [loadMore, isFetchingNextPage]);

  if (isLoading) {
    return <Loader />;
  }
  if (_.isEmpty(sessions)) {
    return <StyledEmpty>No sessions found</StyledEmpty>;
  }
  const totalCount =  isFetchingNextPage ? _.size(sessions) + 1 : _.size(sessions)
  return (
    <StyledList>
      <ListHeader />
      <Virtuoso
        endReached={noLoadMore}
        useWindowScroll
        totalCount={totalCount}
        itemContent={(index) => {
          const session = sessions[index];          
          return <ListSession swapLog={session} isLast ={index + 1 === totalCount} />;
        }}
      />
    </StyledList>
  );
};

const StyledEmpty = styled.div`
  padding: 20px;
`;

const Loader = styled(PageLoader)`
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
      <IconButton
        isRound={true}
        aria-label="Done"
        fontSize="15px"
        style={{
          backgroundColor: "#f8f9fb",
          color: "#4a5568",
          border: "1px solid #e2e8f0",
        }}
        size={"sm"}
        icon={<ArrowForwardIcon />}
        onClick={onNavigate}
      />
    </StyledButtons>
  );
};
const Timestamp = () => {
  const session = useSessionContext();
  return (
    <StyledItem>
      <RowText text={moment(session.timestamp).format("lll")} />
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
        <AddressLink path="address" chainId={chainId} text={tokenInName} address={tokenInAddress} />
        <ChevronRightIcon />
        <AddressLink path="address" chainId={chainId} text={tokenOutName} address={tokenInAddress} />
      </StyledTokens>

  );
};

const StyledTokens = styled(StyledRow)({
  fontSize: 13,
  "*":{
    fontWeight: 400
  }
})

const SessionId = () => {
  const session = useSessionContext();
  return (
    <StyledRow>
      <RowText text={session.id} />
    </StyledRow>
  );
};

const TxHash = () => {
  const session = useSessionContext();
  const { txHash, chainId } = session;
  return (
    <StyledItem>
      <StyledText>
        <AddressLink
          text={makeElipsisAddress(txHash, 4)}
          address={txHash}
          path="tx"
          chainId={chainId}
        />
      </StyledText>
    </StyledItem>
  );
};

const SwapStatus = () => {
  const session = useSessionContext();


  return (
    <StyledItem>
     <StatusBadge swapStatus={session.swapStatus}  />
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

const StyledItem = styled(StyledRow)``;

const StyledText = styled(Text)`
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
  border-bottom:  ${({ theme}) => `2px solid ${theme.colors.border}`};
  padding: 10px 15px;
  gap: 0px;
  position: relative;
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

const StyledHeaderItem = styled(Text)({
  fontSize: 14,
  textAlign: "left",
  paddingRight: 20,
  fontWeight: 600,
  "&:last-child": {
   textAlign: "center",
   paddingRight: 0,
 }
});

const StyledList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;

`;

const Network = () => {
  const session = useSessionContext();
  const chainConfig = useChainConfig(session.chainId);
  return (
    <StyledItem>
      <RowText text={chainConfig?.name} />
      <Avatar width="18px" height="18px" src={chainConfig?.logoUrl} />
    </StyledItem>
  );
};

const components = [
  <SessionId />,
  <Dex />,
  <Network />,
  <Timestamp />,
  <Tokens />,
  <Usd />,
  <TxHash />,
  <SwapStatus />,
  <GoButton />,
];

const titles = [
  "Session id",
  "Dex",
  "Network",
  "Date",
  "Tokens",
  "USD",
  "Tx hash",
  "Status",
  'Action'
];

const ListHeader = () => {
  return (
    <StyledHeader>
      {_.map(titles, (title, index) => {
        return (
          <StyledHeaderItem
            key={index}
            style={{
              width: `${widthArr[index]}%`,
            }}
          >
            {title}
          </StyledHeaderItem>
        );
      })}
    </StyledHeader>
  );
};

export const ListSession = ({ swapLog, isLast }: { swapLog: SwapLog, isLast: boolean }) => {
  if (!swapLog) {
    return (
      <StyledLoaderContainer>
        <Spinner />
      </StyledLoaderContainer>
    );
  }  

  return (
    <Context.Provider value={swapLog}>
      <ListSessionContainer style={{borderBottom: isLast ? 'unset' :''}}>
        {components.map((component, index) => {
          return (
            <StyledListComponent
              key={index}
              style={{ width: `${widthArr[index]}%` }}
            >
              {component}
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
  textAlign: "left",
  paddingRight: 20,
  height: 30,
 "&:last-child": {
    paddingRight: 10,
 }
});



const widthArr = [11, 10, 13, 16, 14, 10, 11, 10, 5];
