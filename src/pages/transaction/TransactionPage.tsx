import { Avatar } from "@chakra-ui/react";
import { AddressLink, Card, FormattedAmount, PageLoader } from "components";
import { ColumnFlex, RowFlex } from "styles";
import styled from "styled-components";
import _ from "lodash";
import {
  useExactAmountOutPreDeduction,
  useOutTokenUsd,
  useSession,
  useToken,
  useTransfers,
} from "./hooks";
import { ReactNode, useMemo } from "react";
import {
  useAmountUI,
  useChainConfig,
  useDexConfig,
  useNumberFormatter,
} from "hooks";
import { amountUiV2, makeElipsisAddress } from "helpers";
import { TransferLog } from "types";
import BN from "bignumber.js";

import {
  ListItem,
  StyledDivider,
  StyledRowText,
  TokenAmount,
} from "./components/shared";
import { SessionLogs } from "./components/Logs";
import { DebugComponent } from "./components/DebugComponent";
import moment from "moment";
import { StatusBadge } from "components/StatusBadge";
import { addSlippage } from "utils";
import { GasUsed } from "./components/GasUsed";
import { LogTrace } from "./components/LogTrace";
import { Savings } from "./components/Savings";

export function TransactionPage() {
  const { data: session, isLoading: sessionLoading } = useSession();
  const inToken = useToken(session?.tokenInAddress, session?.chainId);
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const isLoading = sessionLoading || !inToken || !outToken;

  return (
    <Container>
      {isLoading ? (
        <Section>
          <PageLoader />
        </Section>
      ) : !session ? (
        <Section>
          <p>Session not found</p>
        </Section>
      ) : (
        <Content />
      )}
    </Container>
  );
}

const Network = () => {
  const session = useSession().data;
  const config = useChainConfig(session?.chainId);
  const networkName = config?.name;
  const logo = config?.logoUrl;
  return (
    <ListItem label="Network">
      <StyledRowText>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Avatar src={logo} style={{ width: "20px", height: "20px" }} />
          {networkName}
        </span>
      </StyledRowText>
    </ListItem>
  );
};

const Content = () => {
  return (
    <StyledSessionDisplay>
      <Section>
        <Network />
        <Dex />
        <Timestamp />
        <User />
      </Section>
      <Section>
        <Status />
        <TxHash />
        <Slippage />
        <InTokenAmount />
        <DexAmountOut />
        <ExpectedToReceiveLH />
        <ExactAmountReceivedPreDeductions />
        <GasUsed />
        <Fees />
        <ExactAmountReceivedPostDeductions />
        <Savings />
      </Section>
      <DebugComponent>
        <Section>
          <SessionLogs />
          <Transfers />
          <LogTrace />
        </Section>
      </DebugComponent>
    </StyledSessionDisplay>
  );
};

const Slippage = () => {
  const session = useSession().data;
  return (
    <ListItem label="User Slippage" tooltip="The slippage user sets in the UI">
      <StyledRowText>{session?.slippage}%</StyledRowText>
    </ListItem>
  );
};

const Dex = () => {
  const session = useSession().data;
  const dexConfig = useDexConfig(session?.dex);

  return (
    <ListItem label="Dex">
      <RowFlex $gap={8}>
        <Avatar src={dexConfig?.logoUrl} style={{ width: 20, height: 20 }} />
        <StyledRowText>{session?.dex}</StyledRowText>
      </RowFlex>
    </ListItem>
  );
};
const User = () => {
  const session = useSession().data;

  return (
    <ListItem label="User's address">
      <AddressLink underline address={session?.userAddress} short={true} />
    </ListItem>
  );
};
const Timestamp = () => {
  const session = useSession().data;
  return (
    <ListItem label="Timestamp">
      <RowFlex>
        <StyledRowText>
          {moment(session?.timestamp).format("lll")}
        </StyledRowText>
        <AddressLink
          chainId={session?.chainId}
          address={session?.blockNumber?.toString()}
          path="block"
          text={`(${session?.blockNumber})`}
        />
      </RowFlex>
    </ListItem>
  );
};

const InTokenAmount = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenInAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.amountIn);
  return (
    <ListItem label="Amount in">
      <TokenAmount
        amount={amount}
        address={session?.tokenInAddress}
        symbol={token?.symbol}
        usd={session?.amountInUsd}
      />
    </ListItem>
  );
};

const Status = () => {
  const session = useSession().data;

  return (
    <ListItem label="Status">
      <StatusBadge swapStatus={session?.swapStatus} />
    </ListItem>
  );
};
const TxHash = () => {
  const session = useSession().data;
  return (
    <ListItem label="Transaction hash">
      <AddressLink
        underline
        address={session?.txHash}
        text={makeElipsisAddress(session?.txHash, 10)}
        path="tx"
        chainId={session?.chainId}
      />
    </ListItem>
  );
};

const ExpectedToReceiveLH = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const lhAmountWSF = useAmountUI(
    outToken?.decimals,
    session?.lhAmountOutWS
  );
  const usd = useOutTokenUsd(lhAmountWSF)

  return (
    <ListItem label="LH amount out (estimate)">
      <TokenAmount
        amount={lhAmountWSF}
        address={session?.tokenOutAddress}
        symbol={outToken?.symbol}
        usd={usd as string}
      />
    </ListItem>
  );
};

const DexAmountOut = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const dexAmount = useAmountUI(
    outToken?.decimals,
    session?.dexEstimateAmountOut
  );

  return (
    <ListItem label="Dex amount out">
      <TokenAmount
        amount={dexAmount || "0"}
        symbol={outToken?.symbol}
        address={session?.tokenOutAddress}
      />
    </ListItem>
  );
};

const Fees = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(outToken?.decimals, session?.feeOutAmount);
  const fee = useNumberFormatter({
    value: amount,
  });
  const usdFallback = useOutTokenUsd(amount);
  const usdValue = session?.feeOutAmountUsd || usdFallback;
  const usd = useNumberFormatter({ value: usdValue });
  return (
    <ListItem label="Fees">
      <TokenAmount
        address={outToken?.address}
        amount={fee as string}
        usd={usd as string}
        symbol={outToken?.symbol}
      />
    </ListItem>
  );
};

const ExactAmountReceivedPreDeductions = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const exactOutAmountPreDeduction = useExactAmountOutPreDeduction()
  const amount = useAmountUI(outToken?.decimals, exactOutAmountPreDeduction);
  const usd = useOutTokenUsd(amount);


  return (
    <ListItem label="LH amount out (actual pre deductions)">
      <TokenAmount
        address={session?.tokenOutAddress}
        amount={amount as string}
        symbol={outToken?.symbol}
        usd={usd as string}
      />
    </ListItem>
  );
};

const ExactAmountReceivedPostDeductions = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(outToken?.decimals, session?.exactOutAmount)
  const usd = session?.exactOutAmountUsd

  return (
    <ListItem label="LH amount out (actual post deductions)">
      <TokenAmount
        address={session?.tokenOutAddress}
        amount={amount as string}
        symbol={outToken?.symbol}
        usd={usd as string}
      />
    </ListItem>
  );
};


const ExactAmountOut = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.exactOutAmount);
  return (
    <ListItem label="Exact amount out">
      <TokenAmount symbol={token?.symbol} address={session?.tokenOutAddress} amount={amount} />
    </ListItem>
  );
};

const DucthPrice = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.dutchPrice);
  return (
    <ListItem label="Dutch price">
      <TokenAmount symbol={token?.symbol} address={session?.tokenOutAddress} amount={amount} />
    </ListItem>
  );
};

const Transfers = () => {
  const { data: session } = useSession();
  const transfers = useTransfers().data;
  if (!transfers || !session) return null;

  return (
    <>
      <StyledDivider />
      <ExactAmountOut />
      <Fees />
      <GasUsed />
      <DucthPrice />
      <ListItem label="ERC-20 Tokens Transferred">
        <StyledTransfers>
          {transfers?.map((transfer, index) => {
            return <Transfer key={index} log={transfer} />;
          })}
        </StyledTransfers>
      </ListItem>
    </>
  );
};

const Transfer = ({ log }: { log: TransferLog }) => {
  const session = useSession().data;
  return (
    <StyledRow>
      <strong>From </strong>
      <AddressLink
        hideCopy
        chainId={session?.chainId}
        address={log.from}
        short
      />{" "}
      <strong> To </strong>
      <AddressLink
        hideCopy
        chainId={session?.chainId}
        address={log.to}
        short
      />{" "}
      <strong>For</strong> <FormattedAmount value={log.value} />{" "}
      <AddressLink
        hideCopy
        chainId={session?.chainId}
        address={log.token.address}
        text={log.token.symbol}
      />
    </StyledRow>
  );
};

const StyledRow = styled(RowFlex)`
  justify-content: flex-start;
  width: 100%;
  gap: 5px;
  strong {
    font-weight: 600;
  }
`;

const StyledTransfers = styled(ColumnFlex)`
  width: 100%;
`;

const StyledSessionDisplay = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 10px;
`;

const Container = styled.div``;

const Section = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  return (
    <StyledSection>
      {title && <h3>{title}</h3>}
      {children}
    </StyledSection>
  );
};

const StyledSection = styled(Card)`
  gap: 15px;
  padding: 20px;
`;
