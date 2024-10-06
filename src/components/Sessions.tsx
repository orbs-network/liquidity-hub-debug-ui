import styled from "styled-components";
import { RowFlex } from "../styles";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import TextOverflow from "react-text-overflow";
import { IconButton, Text } from "@chakra-ui/react";
import { ROUTES } from "../config";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { useNumberFormatter } from "../hooks";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { makeElipsisAddress, swapStatusText } from "../helpers";
import { PageLoader } from "./PageLoader";
import { ClobSession } from "types";
import { AddressLink } from "./AddressLink";
import { useChainLogo } from "pages";
const titles = [
  
  "Session id",
  "Tx hash",
  "Tokens",
  "Dex",
  "Timestamp",
  "$USD",
  "Swap status",
];

export const StyledRow = styled(RowFlex)`
  text-align: left;
  padding-right: 0px;
  
  width: calc(100% / ${_.size(titles)} - 15px);
`;

export const Sessions = ({
  sessions = [],
  isLoading,
}: {
  sessions?: ClobSession[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return <Loader />;
  }
  if (_.isEmpty(sessions)) {
    return <StyledEmpty>No sessions found</StyledEmpty>;
  }

  return (
    <StyledList>
      <ListHeader />
      <AutoSizer>
        {({ height, width }: any) => (
          <List
            overscanCount={5}
            className="List"
            itemData={sessions}
            height={height || 0}
            itemCount={_.size(sessions)}
            itemSize={60}
            width={width || 0}
          >
            {ListSession}
          </List>
        )}
      </AutoSizer>
    </StyledList>
  );
};

const StyledEmpty = styled.div`
  padding: 20px;
`;

const Loader = styled(PageLoader)`
  padding: 20px;
`;

const Network = ({chainId}: {chainId?: string}) => {
  const networkName = '';
  const logo = useChainLogo(Number(chainId));
  return (
    <StyledRow style={{width: "32px"}}>
      <span style={{display: "flex", alignItems: "center", gap: "5px"}}>
      <img style={{width: "20px", height: "20px"}} src={logo} alt={networkName} />
      {networkName}
      </span >
      </StyledRow>
  )
}

export const ListSession = ({ index, style, data }: any) => {
  const session = data[index] as ClobSession;
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(ROUTES.navigate.clobSession(session.id));
  };

  return (
    <div style={style}>
      <ListSessionContainer>
        <Network chainId={session.chainId?.toString()} />
        <SessionId id={session.id} />
        <TxHash session={session} />
        <Tokens session={session} />
        <Dex dex={session.dex} />
        <Timestamp timestamp={session.timestamp} />
        <AmountOutUI value={session.amountOutUSD} />
        <SwapStatus status={session.swapStatus} />
        <StyledButtons>
          <IconButton
            isRound={true}
            variant="solid"
            colorScheme="teal"
            aria-label="Done"
            fontSize="15px"
            size={"sm"}
            icon={<ArrowForwardIcon />}
            onClick={onNavigate}
          />
        </StyledButtons>
      </ListSessionContainer>
    </div>
  );
};
const Timestamp = ({ timestamp }: { timestamp?: string }) => {
  return (
    <StyledItem>
      <RowText text={timestamp} />
    </StyledItem>
  );
};

const Dex = ({ dex }: { dex?: string }) => {
  return (
    <StyledItem>
      <RowText text={dex} />
    </StyledItem>
  );
};

const Tokens = ({ session }: { session: ClobSession }) => {
  return (
    <StyledRow>
      <RowText text={`${session.tokenInSymbol} -> ${session.tokenOutSymbol}`} />
    </StyledRow>
  );
};

const SessionId = ({ id }: { id?: string }) => {
  return (
    <StyledRow>
      <RowText text={id} />
    </StyledRow>
  );
};

const TxHash = ({ session }: { session?: ClobSession }) => {
  return (
    <StyledItem>
      <StyledText>
        <AddressLink
          text={makeElipsisAddress(session?.txHash)}
          address={session?.txHash}
          path="tx"
          chainId={session?.chainId}
        />
      </StyledText>
    </StyledItem>
  );
};

const SwapStatus = ({ status }: { status?: string }) => {
  return (
    <StyledItem>
      <RowText text={swapStatusText(status)} />
    </StyledItem>
  );
};

const AmountOutUI = ({ value, decimalScale }: { value?: number | string, decimalScale?: number }) => {
  const result = useNumberFormatter({ value, decimalScale })?.toString();

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
  font-size: 14px;
`;

const StyledButtons = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const ListSessionContainer = styled(RowFlex)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.border}`};
  padding: 0px 15px;
  gap: 0px;
`;

const ListHeader = () => {
  return (
    <StyledHeader>
      {_.map(titles, (title, index) => {
        return <StyledHeaderItem key={index}>{title}</StyledHeaderItem>;
      })}
    </StyledHeader>
  );
};

const StyledHeader = styled(RowFlex)`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.border}`};
  justify-content: flex-start;
  padding: 0px 15px;
  height: 50px;
  gap: 0px;
  font-weight: 500;
`;

const StyledHeaderItem = styled(StyledRow)`
  font-size: 14px;
`;

const StyledList = styled.div`
  flex: 1;
  width: 100%;
`;
