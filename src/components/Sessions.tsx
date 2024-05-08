import styled from "styled-components";
import { RowFlex } from "../styles";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import TextOverflow from "react-text-overflow";
import { Text } from "@chakra-ui/react";
import { ROUTES } from "../config";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { useNumberFormatter } from "../hooks";
import { makeElipsisAddress, swapStatusText } from "../helpers";
import { PageLoader } from "./PageLoader";
import { ClobSession } from "types";
import { AddressLink } from "./AddressLink";

export const StyledRow = styled(RowFlex)`
  text-align: left;
  padding-right: 10px;
  justify-content: flex-start;
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

export const ListSession = ({ index, style, data }: any) => {
  const session = data[index] as ClobSession;
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(ROUTES.navigate.clobSession(session.id));
  };

  return (
    <div style={style}>
      <ListSessionContainer onClick={onNavigate}>
        {SessionsListData.map((item, index) => {
          const Component = item.Component;
          return (
            <StyledItem $width={item.width} key={index}>
              <Component session={session} />
            </StyledItem>
          );
        })}
      </ListSessionContainer>
    </div>
  );
};
const Timestamp = ({ session }: { session?: ClobSession }) => {
  return (
    <RowText text={session?.timestamp} />
  );
};

const Dex = ({ session }: { session?: ClobSession }) => {
  return (
    <RowText text={session?.dex} />
  );
};

const Tokens = ({ session }: { session: ClobSession }) => {
  return (
    <RowText text={`${session.tokenInSymbol} -> ${session.tokenOutSymbol}`} />
  );
};

const SessionId = ({ session }: { session?: ClobSession }) => {
  return (
    <RowText text={session?.id} />
  );
};

const TxHash = ({ session }: { session?: ClobSession }) => {
  return (
    <StyledText>
      <AddressLink
        text={makeElipsisAddress(session?.txHash)}
        address={session?.txHash}
        path="tx"
        chainId={session?.chainId}
      />
    </StyledText>
  );
};

const SwapStatus = ({ session }: { session?: ClobSession }) => {
  return <RowText text={swapStatusText(session?.swapStatus)} />;
};

const AmountOutUI = ({ session }: { session?: ClobSession }) => {
  const result = useNumberFormatter({
    value: session?.amountOutUSD,
  })?.toString();

  return <RowText text={result ? `$${result}` : "-"} />;
};

const RowText = ({ text = "-" }: { text?: string }) => {
  return (
    <StyledText>
      <TextOverflow text={text} />
    </StyledText>
  );
};

const StyledItem = styled(StyledRow)<{ $width: string }>`
  width: ${({ $width }) => $width};
`;

const StyledText = styled(Text)`
  font-size: 14px;
`;

const ListSessionContainer = styled(RowFlex)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.border}`};
  padding: 0px 15px;
  gap: 0px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const ListHeader = () => {
  return (
    <StyledHeader>
      {_.map(SessionsListData, (it, index) => {
        return (
          <StyledHeaderItem $width={it.width} key={index}>
            {it.title}
          </StyledHeaderItem>
        );
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

const StyledHeaderItem = styled(StyledRow)<{ $width: string }>`
  font-size: 14px;
  width: ${({ $width }) => $width};
`;

const StyledList = styled.div`
  flex: 1;
  width: 100%;
`;

export const SessionsListData = [
  { title: "Session id", width: "15%", Component: SessionId },
  { title: "Tx hash", width: "15%", Component: TxHash },
  { title: "Tokens", width: "15%", Component: Tokens },
  { title: "Dex", width: "15%", Component: Dex },
  { title: "Timestamp", width: "15%", Component: Timestamp },
  { title: "Amount out Usd", width: "15%", Component: AmountOutUI },
  { title: "Swap status", width: "10%", Component: SwapStatus },
];
