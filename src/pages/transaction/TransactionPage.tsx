import { Avatar } from "@chakra-ui/react";
import { AddressLink, Card, FormattedAmount, PageLoader } from "components";
import { ColumnFlex, RowFlex } from "styles";
import styled from "styled-components";
import _ from "lodash";
import { useSession, useToken, useTransfers } from "./hooks";
import { ReactNode, useMemo } from "react";
import {
  useAmountUI,
  useChainConfig,
  useDexConfig,
  useNumberFormatter,
  useTokenAmountUsd,
} from "hooks";
import { makeElipsisAddress } from "helpers";
import { TransferLog } from "types";
import { zeroAddress } from "@defi.org/web3-candies";
import BN from "bignumber.js";

import {
  ListItem,
  StyledDivider,
  StyledRowText,
  TokenAmount,
  WithUSD,
} from "./components/shared";
import { SessionLogs } from "./Logs";
import { LogTrace } from "./LogTrace";
import { DebugComponent } from "./components/DebugComponent";
import { Savings } from "./Savings";
import moment from "moment";
import { StatusBadge } from "components/StatusBadge";

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
        <BlockNumber />
        <TxHash />
        <Slippage />
        <InTokenAmount />
        <AmountOut />
        <ExactAmountReceived />
        <GasUsed />
        <Fees />
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
    <ListItem label="Slippage">
      <StyledRowText>{session?.slippage}%</StyledRowText>
    </ListItem>
  );
};

const Dex = () => {
  const session = useSession().data;
  const dexConfig = useDexConfig(session?.dex);

  return (
    <ListItem label="Dex" >
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
      <AddressLink address={session?.userAddress} short={true} />
    </ListItem>
  );
};
const Timestamp = () => {
  const session = useSession().data;
  return (
    <ListItem label="Timestamp">
      <StyledRowText>{moment(session?.timestamp).format("lll")}</StyledRowText>
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
        address={session?.txHash}
        text={makeElipsisAddress(session?.txHash, 10)}
        path="tx"
        chainId={session?.chainId}
      />
    </ListItem>
  );
};

const BlockNumber = () => {
  const session = useSession().data;
  return (
    <ListItem label="Block number">
      <AddressLink
        chainId={session?.chainId}
        address={session?.blockNumber?.toString()}
        path="block"
      />
    </ListItem>
  );
};

const useLHAndDexAmountDiff = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const lhAmount = useAmountUI(outToken?.decimals, session?.lhAmountOut);
  const dexAmount = useAmountUI(outToken?.decimals, session?.dexAmountOut);

  const amountOutDiff = useMemo(() => {
    if (!lhAmount || !dexAmount) return 0;
    const res = BN(lhAmount)
      .minus(dexAmount)
      .div(lhAmount)
      .times(100)
      .toNumber();
    return res;
  }, [dexAmount, lhAmount]);

  return amountOutDiff;
};

const AmountOut = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const lhAmount = useAmountUI(outToken?.decimals, session?.lhAmountOut);
  const dexAmount = useAmountUI(outToken?.decimals, session?.dexAmountOut);
  const amountOutDiff = useLHAndDexAmountDiff();

  return (
    <ListItem label="Expected to receive">
      <RowFlex $justifyContent="flex-start" $gap={5}>
        <span>
          <TokenAmount
            prefix="LH:"
            amount={lhAmount}
            address={session?.tokenOutAddress}
            symbol={outToken?.symbol}
          />
        </span>
        <span>
          <TokenAmount
            prefix="Vs Dex:"
            amount={dexAmount || "0"}
            symbol={outToken?.symbol}
            address={session?.tokenOutAddress}
          />
        </span>
        {amountOutDiff !== 0 && (
          <span>
            {" "}
            Diff: <b>{parseFloat(amountOutDiff.toFixed(2))}%</b>
          </span>
        )}
      </RowFlex>
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
  console.log(session);
  

  const usd = useNumberFormatter({ value: session?.feeOutAmountUsd });
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

const ExactAmountReceived = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useNumberFormatter({
    value: useAmountUI(outToken?.decimals, session?.exactOutAmount),
  });

  const usd = useNumberFormatter({
    value: session?.exactOutAmountUsd,
  });

  return (
    <ListItem label="Exact Amount Received">
      <TokenAmount
        address={session?.tokenOutAddress}
        amount={amount as string}
        usd={usd as string}
        symbol={outToken?.symbol}
      />
    </ListItem>
  );
};

const GasUsed = () => {
  const session = useSession().data;
  const amount = session?.gasUsed ? session?.gasUsed / 1e9 : 0;
  const usd = useTokenAmountUsd(zeroAddress, amount, session?.chainId);
  const gas = useNumberFormatter({
    value: amount,
  });
  const _usd = useNumberFormatter({ value: usd });
  const chainConfig = useChainConfig(session?.chainId);

  return (
    <ListItem label="Gas used">
      <TokenAmount
        amount={gas as string}
        usd={_usd as string}
        symbol={chainConfig?.native.symbol}
        address={chainConfig?.native.address}
      />
      <span>{`, ${session?.gasUsed ?? "N/A"} Gwei `}</span>
    </ListItem>
  );
};

const ExactAmountOut = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.exactOutAmount);
  return (
    <ListItem label="Exact amount out">
      <WithUSD address={session?.tokenOutAddress} amount={amount} />
    </ListItem>
  );
};

const DucthPrice = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.dutchPrice);
  return (
    <ListItem label="Dutch price">
      <WithUSD address={session?.tokenOutAddress} amount={amount} />
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
