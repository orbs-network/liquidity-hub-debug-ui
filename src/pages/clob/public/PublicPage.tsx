import { Tag } from "@chakra-ui/react";
import { AddressLink, Card, FormattedAmount, PageLoader } from "components";
import { ColumnFlex, RowFlex } from "styles";
import styled from "styled-components";
import _ from "lodash";
import { useAmountUI, useSession, useSessionTx, useToken } from "./hooks";
import { ReactNode, useMemo } from "react";
import { useChainConfig, useNumberFormatter, useTokenAmountUsd } from "hooks";
import { amountUi, makeElipsisAddress } from "helpers";
import { ClobSession, TransferLog } from "types";
import { zeroAddress } from "@defi.org/web3-candies";
import BN from "bignumber.js";

import {
  ListItem,
  StyledDivider,
  StyledRowText,
  WithSmall,
  WithUSD,
} from "./components/shared";
import { SessionLogs } from "./Logs";
import { LogTrace } from "./LogTrace";
import { DebugComponent } from "./components/DebugComponent";
import { Savings } from "./Savings";

export function PublicPage() {
  const { data: session, isLoading } = useSession();

  return (
    <Container>
      {isLoading ? (
        <PageLoader />
      ) : !session ? (
        <div>Session not found</div>
      ) : (
        <SessionDisplay />
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
          <img
            style={{ width: "20px", height: "20px" }}
            src={logo}
            alt={networkName}
          />
          {networkName}
        </span>
      </StyledRowText>
    </ListItem>
  );
};

const SessionDisplay = () => {
  const session = useSession().data;

  if (!session) return null;

  // const dexAmountOut = useNumberFormatter({ value: session.dexAmountOut, decimalScale: 2 });

  return (
    <StyledSessionDisplay>
      <Section>
        <Network />
        <ListItem label="Dex">
          <StyledRowText>
            {session.dex} Chain ID: {session.chainId}
          </StyledRowText>
        </ListItem>
        <ListItem label="Timestamp">
          <WithSmall
            value={session.timestamp}
            smallValue={session.timeFromNow}
          />
        </ListItem>
        <ListItem label="User's address">
          <AddressLink address={session.userAddress} />
        </ListItem>
      </Section>
      <Section>
        <TxHash />
        <ListItem label="Slippage">
          <StyledRowText>{session.slippage?.toFixed(2)}%</StyledRowText>
        </ListItem>
        <InTokenAmount />
        <AmountOut />
        <ExactAmountReceived />
        <GasUsed />
        <Status />
        <Fees />
      </Section>

      <StyledDivider />

      <Savings />

      <StyledDivider />
      <TxDetails />
      <DebugComponent>
        <SessionLogs />
      </DebugComponent>
      <DebugComponent>
        <Transfers />
      </DebugComponent>

      <DebugComponent>
        <LogTrace />
      </DebugComponent>
    </StyledSessionDisplay>
  );
};

const InTokenAmount = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenInAddress, session?.chainId);
  return (
    <ListItem label="Amount in">
      <TokenAmount
        amount={session?.amountInUI}
        address={session?.tokenInAddress}
        symbol={token?.symbol}
        usd={session?.amountInUSD}
      />
    </ListItem>
  );
};

const Status = () => {
  const session = useSession().data;

  return <ListItem label="Swap status">
    <Tag>
      <StyledRowText>
        {" "}
        {!session?.txStatus ? '-' : session?.txStatus === "Mined" ? "Success" : "Failure"}
      </StyledRowText>
    </Tag>
  </ListItem>;
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
// const StyledLogContent = styled(RowFlex)`
//   justify-content: flex-start;
//   flex-wrap: wrap;
// `;
const TxDetails = () => {
  const session = useSession().data;
  if (!session) return null;
  return (
    <>
      <ListItem label="Status">
        {session.txStatus ? (
          <Tag>
            <StyledRowText>
              {session.txStatus === "Mined" ? "Success" : "Failure"}
            </StyledRowText>
          </Tag>
        ) : (
          "-"
        )}
      </ListItem>
      {/* <ListItem label="Block number">
        {tx ? <StyledRowText>{tx.blockNumber}</StyledRowText> : "-"}
      </ListItem> */}
    </>
  );
};

const useLHAndDexAmountDiff = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const lhAmount = useAmountUI(outToken?.decimals, session?.amountOutRaw);
  const dexAmount = useAmountUI(outToken?.decimals, session?.dexAmountOut);

  const amountOutDiff = useMemo(() => {
    if (!lhAmount || !dexAmount) return "0";
    const res = BN(lhAmount)
      .minus(dexAmount)
      .div(lhAmount)
      .times(100)
      .toFixed(2);
    return res;
  }, [dexAmount, lhAmount]);

  return amountOutDiff;
};

const AmountOut = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const lhAmount = useAmountUI(outToken?.decimals, session?.amountOutRaw);
  const dexAmount = useAmountUI(outToken?.decimals, session?.dexAmountOut);
  const amountOutDiff = useLHAndDexAmountDiff();

  return (
    <ListItem label="Expected to receive">
      <RowFlex $justifyContent="flex-start" $gap={5}>
        <span>
          <TokenAmount
            prefix="Orbs:"
            amount={lhAmount}
            address={session?.tokenOutAddress}
            symbol={outToken?.symbol}
            usd={session?.amountOutUSD}
          />
        </span>
        <span>
          <TokenAmount
            prefix="Vs Dex:"
            amount={dexAmount}
            usd={session?.dexAmountOutUSD}
            symbol={outToken?.symbol}
            address={session?.tokenOutAddress}
          />
        </span>
        <span>
          {" "}
          Diff: <b>{amountOutDiff}%</b>
        </span>
      </RowFlex>
    </ListItem>
  );
};

const TokenAmount = ({
  prefix,
  symbol,
  address,
  amount,
  usd,
}: {
  symbol?: string;
  address?: string;
  amount?: string | number;
  usd?: string | number;
  prefix?: string;
}) => {
  const session = useSession().data;
  const formattedAmount = useNumberFormatter({
    value: amount,
    decimalScale: 3,
  });
  const formattedUsd = useNumberFormatter({ value: usd, decimalScale: 2 });
  return (
    <RowFlex $gap={5}>
      <p>
        {prefix} {formattedAmount || "-"}
        <small style={{ fontSize: 13, opacity: 0.8 }}>
          {` ($${formattedUsd || "-"})`}
        </small>
      </p>
      <AddressLink
        path="address"
        address={address}
        text={symbol}
        chainId={session?.chainId}
      />
    </RowFlex>
  );
};

const Fees = () => {
  const tx = useSessionTx().data;
  const session = useSession().data;
  const chainConfig = useChainConfig(session?.chainId);
  const usd = useTokenAmountUsd(zeroAddress, tx?.fees, session?.chainId);
  const fee = useNumberFormatter({ value: tx?.fees });
  const _usd = useNumberFormatter({ value: usd });
  return (
    <ListItem label="Fee">
      <WithSmall
        value={`${fee} ${chainConfig?.native.symbol}`}
        smallValue={`$${_usd}`}
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
    value: session?.amountOutUSD,
    decimalScale: 0,
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
  const tx = useSessionTx().data;
  const session = useSession().data;
  const usd = useTokenAmountUsd(
    zeroAddress,
    tx?.gasUsedNativeToken,
    session?.chainId
  );
  const gas = useNumberFormatter({ value: tx?.gasUsedNativeToken });
  const _usd = useNumberFormatter({ value: usd });
  const chainConfig = useChainConfig(session?.chainId);

  return (
    <ListItem label="Gas used">
      <RowFlex $gap={2}>
        <span>{`${session?.gasUsed ?? "N/A"} Gwei, `}</span>
        <WithSmall
          value={`${gas} ${chainConfig?.native.symbol}`}
          smallValue={`$${_usd}`}
        />
      </RowFlex>
    </ListItem>
  );
};



const ExactAmountOut = () => {
  const tx = useSessionTx()?.data;
  const session = useSession().data;
  return (
    <ListItem label="Exact amount out">
      <WithUSD
        address={session?.tokenOutAddress}
        amount={tx?.exactAmountOut || session?.exactOutAmount}
      />
    </ListItem>
  );
};

const DucthPrice = () => {
  const tx = useSessionTx()?.data;
  const session = useSession().data;
  return (
    <ListItem label="Dutch price">
      <WithUSD address={session?.tokenOutAddress} amount={tx?.dutchPrice} />
    </ListItem>
  );
};

const FeePercentFromExactAmountOut = () => {
  const tx = useSessionTx()?.data;
  const value = useNumberFormatter({ value: tx?.feesPercent, decimalScale: 2 });

  return (
    <ListItem label="Fee % from amount out">
      <StyledRowText>{`${value}%`}</StyledRowText>
    </ListItem>
  );
};

const DucthPriceDiffPerecent = () => {
  const tx = useSessionTx()?.data;
  const value = useNumberFormatter({ value: tx?.comparedToDutch });

  return (
    <ListItem label="Dutch price diff">
      <StyledRowText>{`${value}%`}</StyledRowText>
    </ListItem>
  );
};

const Transfers = () => {
  const { data: session } = useSession();
  const { data: tx } = useSessionTx();

  if (!tx || !session) return null;

  return (
    <>
      <StyledDivider />
      <ExactAmountOut />
      <Fees />
      <FeePercentFromExactAmountOut />
      <GasUsed />
      <DucthPrice />
      <DucthPriceDiffPerecent />
      <ListItem label="ERC-20 Tokens Transferred">
        <StyledTransfers>
          {tx.transfers?.map((transfer, index) => {
            return <Transfer session={session} key={index} log={transfer} />;
          })}
        </StyledTransfers>
      </ListItem>
    </>
  );
};

const Transfer = ({
  log,
  session,
}: {
  log: TransferLog;
  session: ClobSession;
}) => {
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
