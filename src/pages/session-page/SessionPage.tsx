import { Text } from "@chakra-ui/react";
import { AddressLink, Card, FormattedAmount, PageLoader } from "../../components";
import { ColumnFlex, RowFlex } from "../../styles";
import styled from "styled-components";
import _ from "lodash";
import { Logs } from "./Logs";
import { useSession } from "./hooks";
import { SessionEvents } from "./Events";
import { ReactNode } from "react";
import { Session } from "../../types";
import { useNumberFormatter } from "../../hooks";
import { swapStatusText } from "../../helpers";

export function SessionPage() {
  return (
    <Container>
      <Content />
    </Container>
  );
}

const Content = () => {
  const { data: session, isLoading } = useSession();
  console.log({ session });
  
  if (isLoading) {
    return <PageLoader />;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return <SessionDisplay />;
};
const SessionDisplay = () => {
  const session = useSession().data;

  if (!session) return null;
  return (
    <StyledSessionDisplay>
      <StyledList>
        <ListItem label="Dex">
          <StyledRowText>{session.dex}</StyledRowText>
        </ListItem>
        <ListItem label="Session ID">
          <StyledRowText>{session.id} </StyledRowText>
        </ListItem>
        <ListItem label="Wallet address">
          <AddressLink address={session.userAddress} />
        </ListItem>
        <ListItem label="In token">
          <StyledRowColumn>
            <StyledRowText>Symbol: {session.tokenInSymbol}</StyledRowText>
            <RowFlex>
              Address: <AddressLink address={session.tokenInAddress} />
            </RowFlex>
          </StyledRowColumn>
        </ListItem>
        <ListItem label="Out token">
          <StyledRowColumn>
            <StyledRowText>Symbol: {session.tokenOutSymbol}</StyledRowText>
            <RowFlex>
              Address: <AddressLink address={session.tokenOutAddress} />
            </RowFlex>
          </StyledRowColumn>
        </ListItem>
        <ListItem label="Amounts">
          <StyledRowText>
            Amount in:{" "}
            <FormattedAmount value={session.amountInUI} decimalScale={18} />
          </StyledRowText>
          <StyledRowText>
            Amount out:{" "}
            <FormattedAmount value={session.amountOutUI} decimalScale={18} />
          </StyledRowText>
          <StyledRowText>
            Dex amount out:{" "}
            <FormattedAmount value={session.dexAmountOut} decimalScale={18} />{" "}
          </StyledRowText>
          <StyledRowText>
            Amount out diff: <FormattedAmount value={session.amountOutDiff} />
          </StyledRowText>
        </ListItem>

        <ListItem label="Chain ID">
          <StyledRowText>{session.chainId}</StyledRowText>
        </ListItem>
        <ListItem label="Slippage">
          <StyledRowText>{session.slippage}</StyledRowText>
        </ListItem>
        <ListItem label="Transaction hash">
          <AddressLink
            address={session.txHash}
            path="tx"
            chainId={session.chainId}
          />
        </ListItem>
        <ListItem label="Amount in USD">
          <StyledRowText>${session.amountInUSD}</StyledRowText>
        </ListItem>
        <ListItem label="Amount out USD">
          <StyledRowText>${session.amountOutUSD}</StyledRowText>
        </ListItem>
        <ListItem label="Swap status">
          <StyledRowText>{swapStatusText(session.swapStatus)}</StyledRowText>
        </ListItem>
        <TxActionRow session={session} />
        <ListItem label="ERC-20 Tokens Transferred">
          <SessionEvents />
        </ListItem>
      </StyledList>
      <Logs session={session} />
    </StyledSessionDisplay>
  );
};

const TxActionRow = ({ session }: { session: Session }) => {
  const amountInUI = useNumberFormatter({ value: session.amountInUI });
  const amountOutUI = useNumberFormatter({ value: session.amountOutUI });

  return (
    <ListItem label="Transaction Action">
      <RowFlex $justifyContent="flex-start" $gap={5}>
        <span>Swap {amountInUI}</span>
        <AddressLink
          address={session.tokenInAddress}
          text={session.tokenInSymbol}
        />
        <span>{`for ${amountOutUI}`} </span>
        <AddressLink
          address={session.tokenOutAddress}
          text={session.tokenOutSymbol}
        />
      </RowFlex>
    </ListItem>
  );
};

const StyledRowColumn = styled(ColumnFlex)`
  align-items: flex-start;
  gap: 5px;
`;

const StyledSessionDisplay = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 20px;
`;

const ListItem = ({ label, children }: { label: string; children?: ReactNode }) => {
  return (
    <StyledListItem>
      <RowLabel label={label} />
      <StyledRowChildren>{children}</StyledRowChildren>
    </StyledListItem>
  );
};

const StyledRowChildren = styled.div`
  flex: 1;
`;

const RowLabel = ({ label }: { label: string }) => {
  return <StyledRowLabel>{label}</StyledRowLabel>;
};

const StyledRowLabel = styled(Text)`
  width: 240px;
  padding-right: 20px;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-weight: 500;
  font-size: 14px;
`;

const StyledRowText = styled(Text)`
  white-space: wrap;
  line-break: anywhere;
  font-size: 14px;
`;

const StyledList = styled(ColumnFlex)`
  width: 100%;
  gap: 0px;
`

const StyledListItem = styled(RowFlex)`
  gap: 10px;
  width: 100%;
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 14px 0px 14px 0px;
  align-items: flex-start;
`;

const Container = styled(Card)`
  gap: 20px;
  padding: 20px;
`;
