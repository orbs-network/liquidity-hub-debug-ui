import { Tag, Text } from "@chakra-ui/react";
import {
  AddressLink,
  Card,
  FormattedAmount,
  PageLoader,
} from "../../../components";
import { ColumnFlex, RowFlex } from "../../../styles";
import styled from "styled-components";
import _ from "lodash";
import { LogModal } from "./LogModal";
import { useSession, useSessionTx } from "./hooks";
import { ReactNode } from "react";
import { useNumberFormatter } from "../../../hooks";
import { getChainConfig, swapStatusText } from "../../../helpers";
import { ClobSession } from "types";

export function ClobSessionPage() {
  return (
    <Container>
      <Content />
    </Container>
  );
}

const Content = () => {
  const { data: session, isLoading } = useSession();

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
        <ListItem label="Chain ID">
          <StyledRowText>{session.chainId}</StyledRowText>
        </ListItem>
        <ListItem label="Session ID">
          <StyledRowText>{session.id} </StyledRowText>
        </ListItem>
        <ListItem label="Wallet address">
          <AddressLink address={session.userAddress} />
        </ListItem>
        <ListItem label="Slippage">
          <StyledRowText>{session.slippage}</StyledRowText>
        </ListItem>
        {session.swapStatus && (
          <ListItem label="Swap status">
            <Tag>
              <StyledRowText>
                {swapStatusText(session.swapStatus)}
              </StyledRowText>
            </Tag>
          </ListItem>
        )}
        <TxActionRow session={session} />
        <StyledDivider />
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
        <StyledDivider />
        <ListItem label="Amount in">
          <StyledRowText>
            <FormattedAmount value={session.amountInUI} decimalScale={18} />
            {session.amountInUSD && (
              <small>{` ($${session.amountInUSD})`}</small>
            )}
          </StyledRowText>
        </ListItem>
        <ListItem label="Amount out">
          <StyledRowText>
            <FormattedAmount value={session.amountOutUI} decimalScale={18} />
            {session.amountOutUSD && (
              <small>{` ($${session.amountOutUSD})`}</small>
            )}
          </StyledRowText>
        </ListItem>
        <ListItem label="Dex amount out">
          <StyledRowText>
            <FormattedAmount value={session.dexAmountOut} decimalScale={18} />
          </StyledRowText>
        </ListItem>
        <ListItem label="Amount out diff">
          <StyledRowText>{session.amountOutDiff}</StyledRowText>
        </ListItem>
        <StyledDivider />

        <ListItem label="Timestamp">
          <StyledRowText>
            {session.timestamp}
            <small>{` (${session.timeFromNow})`}</small>
          </StyledRowText>
        </ListItem>
        <TxDetails />
        <Transfers />
        <Logs />
      </StyledList>
    </StyledSessionDisplay>
  );
};

const Logs = () => {
  const session = useSession().data;
  if (!session || !session.logs) return null;
  return (
    <>
      {session.logs.client && (
        <ListItem label="Client logs">
          {session.logs.client.map((it: any, index: number) => {
            return <LogModal title={`Client ${index + 1}`} key={it} log={it} />;
          })}
        </ListItem>
      )}
      {session.logs.quote && (
        <ListItem label="Quote logs">
          {session.logs.quote.map((it: any, index: number) => {
            return <LogModal title={`Quote ${index + 1}`} key={it} log={it} />;
          })}
        </ListItem>
      )}
      {session.logs.swap && (
        <ListItem label="Swap logs">
          {session.logs.swap.map((it: any, index: number) => {
            return <LogModal title={`Swap ${index + 1}`} key={it} log={it} />;
          })}
        </ListItem>
      )}
    </>
  );
};

const TxDetails = () => {
  const tx = useSessionTx().data;
  const session = useSession().data;
  if (!tx || !session) return null;

  return (
    <>
      <ListItem label="Transaction hash">
        <AddressLink
          address={session.txHash}
          path="tx"
          chainId={session.chainId}
        />
      </ListItem>
      <ListItem label="Status">
        <Tag>
          <StyledRowText>
            {tx.txStatus === "1" ? "Success" : "Failure"}
          </StyledRowText>
        </Tag>
      </ListItem>
      <ListItem label="Block number">
        <StyledRowText>{tx.blockNumber}</StyledRowText>
      </ListItem>
      <ListItem label="Gas price">
        <StyledRowText>
          {tx?.gasUsed}
          <small>{` (${tx?.gasUsedMatic} ${
            getChainConfig(session?.chainId)?.symbol
          })`}</small>
        </StyledRowText>
      </ListItem>
    </>
  );
};

const TxActionRow = ({ session }: { session: ClobSession }) => {
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

const Transfers = () => {
  const { data: session } = useSession();
  const tx = useSessionTx()?.data;

  if (!tx) return null;

  return (
    <>
      <StyledDivider />
      <ListItem label="ERC-20 Tokens Transferred">
        <StyledTransfers>
          {tx.logs?.map((it, index) => {
            return (
              <StyledRow key={index}>
                <strong>From </strong>
                <AddressLink
                  chainId={session?.chainId}
                  address={it.fromAddress}
                  short
                />{" "}
                <strong> To </strong>
                <AddressLink
                  chainId={session?.chainId}
                  address={it.toAddress}
                  short
                />{" "}
                <strong>For</strong> <FormattedAmount value={it.tokenAmount} />{" "}
                <Tag>
                  <StyledUsd>
                    $<FormattedAmount value={it.priceUsd} />
                  </StyledUsd>
                </Tag>
                <AddressLink
                  chainId={session?.chainId}
                  address={it.tokenAddress}
                  text={it.tokenSymbol}
                />
              </StyledRow>
            );
          })}
        </StyledTransfers>
      </ListItem>
      <StyledDivider />
    </>
  );
};

const StyledRow = styled(RowFlex)`
  justify-content: flex-start;
  width: 100%;
`;

const StyledUsd = styled(Text)`
  font-size: 12px;
  font-weight: 600;
`;

const StyledTransfers = styled(ColumnFlex)`
  width: 100%;
`;

const StyledRowColumn = styled(ColumnFlex)`
  align-items: flex-start;
  gap: 5px;
`;

const StyledSessionDisplay = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 20px;
`;

const ListItem = ({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) => {
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
  return <StyledRowLabel>{label}:</StyledRowLabel>;
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
  small {
    opacity: 0.7;
    font-size: 13px;
  }
`;

const StyledList = styled(ColumnFlex)`
  width: 100%;
  gap: 10px;
`;

const StyledListItem = styled(RowFlex)`
  gap: 10px;
  width: 100%;
  font-size: 14px;
  align-items: flex-start;
`;

const StyledDivider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  margin: 8px 0;
`;

const Container = styled(Card)`
  gap: 20px;
  padding: 20px;
`;
