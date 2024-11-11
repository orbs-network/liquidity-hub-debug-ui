import { AddressLink, DataDisplay, FormattedAmount, Page } from "components";
import { ColumnFlex, RowFlex } from "styles";
import styled from "styled-components";
import _ from "lodash";
import { Avatar, Typography } from "antd";
import {
  useDexAmountOutMinusGas,
  useExactAmountOutPreDeduction,
  useExpectedToReceiveLH,
  useOutTokenUsd,
  useSession,
  useTransfers,
} from "./hooks";
import {
  useAmountUI,
  useChainConfig,
  useNumberFormatter,
  useLiquidityHubPartner,
  useToken,
} from "hooks";
import { makeElipsisAddress } from "helpers";
import { TransferLog } from "types";
import { SessionLogs } from "./components/Logs";
import { DebugComponent } from "./components/DebugComponent";
import moment from "moment";
import { StatusBadge } from "components/StatusBadge";
import { LogTrace } from "./components/LogTrace";
import { UserSavings } from "./components/UserSavings";

export function TransactionPage() {
  const { data: session, isLoading: sessionLoading } = useSession();
  const inToken = useToken(session?.tokenInAddress, session?.chainId);
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const isLoading = sessionLoading || !inToken || !outToken;

  return (
    <Page navbar={<Page.Navbar.LiquidityHub />}>
      <Page.Layout isLoading={isLoading}>
        {!session ? (
          <>
            <p>Session not found</p>
          </>
        ) : (
          <Content />
        )}
      </Page.Layout>
    </Page>
  );
}

const SessionId = () => {
  const session = useSession().data;
  return (
    <DataDisplay.Row label="Session ID">
      <DataDisplay.Row.Text>{session?.id}</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Network = () => {
  const session = useSession().data;
  const config = useChainConfig(session?.chainId);
  const networkName = config?.name;
  const logo = config?.logoUrl;
  return (
    <DataDisplay.Row label="Network">
      <DataDisplay.Row.Text>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Avatar src={logo} style={{ width: "20px", height: "20px" }} />
          {networkName}
        </span>
      </DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Content = () => {
  return (
    <DataDisplay>
      <Network />
      <SessionId />
      <Dex />
      <Timestamp />
      <User />
      <DataDisplay.Divider />
      <Status />
      <TxHash />
      <Slippage />
      <InTokenAmount />
      <DataDisplay.Divider />
      <DexAmountOut />
      <ExpectedToReceiveLH />
      <ExactAmountReceivedPreDeductions />
      {/* <GasUsed /> */}
      <Fees />
      <ExactAmountReceivedPostDeductions />
      <UserSavings />

      <DebugComponent>
        <DataDisplay.Divider />
        <SessionLogs />
        <Transfers />
        <LogTrace />
      </DebugComponent>
    </DataDisplay>
  );
};

const Slippage = () => {
  const session = useSession().data;
  return (
    <DataDisplay.Row
      label="User Slippage"
      tooltip="The slippage user sets in the UI"
    >
      <DataDisplay.Row.Text>{session?.slippage}%</DataDisplay.Row.Text>
    </DataDisplay.Row>
  );
};

const Dex = () => {
  const session = useSession().data;
  const partner = useLiquidityHubPartner(session?.dex);

  return (
    <DataDisplay.Row label="Dex">
      <RowFlex $gap={8}>
        <Avatar src={partner?.logoUrl} style={{ width: 20, height: 20 }} />
        <DataDisplay.Row.Text>{session?.dex}</DataDisplay.Row.Text>
      </RowFlex>
    </DataDisplay.Row>
  );
};
const User = () => {
  const session = useSession().data;

  return (
    <DataDisplay.Row label="User's Address">
      <AddressLink underline address={session?.userAddress} short={true} />
    </DataDisplay.Row>
  );
};
const Timestamp = () => {
  const session = useSession().data;
  return (
    <DataDisplay.Row label="Timestamp">
      <RowFlex>
        <DataDisplay.Row.Text>
          {moment(session?.timestamp).format("lll")}
        </DataDisplay.Row.Text>
        <AddressLink
          chainId={session?.chainId}
          address={session?.blockNumber?.toString()}
          path="block"
          text={`(${session?.blockNumber})`}
        />
      </RowFlex>
    </DataDisplay.Row>
  );
};

const InTokenAmount = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenInAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.amountIn);
  return (
    <DataDisplay.Row label="Amount In">
      <DataDisplay.TokenAmount
        amount={amount}
        address={session?.tokenInAddress}
        symbol={token?.symbol}
        usd={session?.amountInUsd}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const Status = () => {
  const session = useSession().data;

  return (
    <DataDisplay.Row label="Status">
      <StatusBadge swapStatus={session?.swapStatus} />
    </DataDisplay.Row>
  );
};
const TxHash = () => {
  const session = useSession().data;
  return (
    <DataDisplay.Row label="Transaction Hash">
      <AddressLink
        underline
        address={session?.txHash}
        text={makeElipsisAddress(session?.txHash, 10)}
        path="tx"
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const ExpectedToReceiveLH = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useExpectedToReceiveLH();
  const amountF = useAmountUI(outToken?.decimals, amount);
  const usd = useOutTokenUsd(amountF);

  return (
    <DataDisplay.Row label="LH Amount Out (estimate)">
      <DataDisplay.TokenAmount
        amount={amountF}
        address={session?.tokenOutAddress}
        symbol={outToken?.symbol}
        usd={usd as string}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const DexAmountOut = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const dexAmountOutMinusGas = useDexAmountOutMinusGas();
  const amount = useAmountUI(outToken?.decimals, dexAmountOutMinusGas);
  const usd = useOutTokenUsd(amount);

  return (
    <DataDisplay.Row
      label="Dex Amount Out (minus gas)"
      tooltip="The amount user would received via dex"
    >
      <DataDisplay.TokenAmount
        amount={amount || "0"}
        symbol={outToken?.symbol}
        address={session?.tokenOutAddress}
        usd={usd}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const Fees = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const fee = useAmountUI(outToken?.decimals, session?.feeOutAmount);

  const usdValue = useOutTokenUsd(fee);
  const usd = useNumberFormatter({ value: usdValue });
  return (
    <DataDisplay.Row label="Fees">
      <DataDisplay.TokenAmount
        address={outToken?.address}
        amount={fee as string}
        usd={usd as string}
        symbol={outToken?.symbol}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const ExactAmountReceivedPreDeductions = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const exactOutAmountPreDeduction = useExactAmountOutPreDeduction();
  const amount = useAmountUI(outToken?.decimals, exactOutAmountPreDeduction);
  const usd = useOutTokenUsd(amount);

  return (
    <DataDisplay.Row label="LH Amount Out (actual pre deductions)">
      <DataDisplay.TokenAmount
        address={session?.tokenOutAddress}
        amount={amount as string}
        symbol={outToken?.symbol}
        usd={usd as string}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const ExactAmountReceivedPostDeductions = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(outToken?.decimals, session?.exactOutAmount);
  const usd = useOutTokenUsd(amount);

  return (
    <DataDisplay.Row label="LH Amount Out (actual post deductions)">
      <DataDisplay.TokenAmount
        address={session?.tokenOutAddress}
        amount={amount as string}
        symbol={outToken?.symbol}
        usd={usd as string}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const ExactAmountOut = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.exactOutAmount);
  return (
    <DataDisplay.Row label="Exact Amount Out">
      <DataDisplay.TokenAmount
        symbol={token?.symbol}
        address={session?.tokenOutAddress}
        amount={amount}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const DucthPrice = () => {
  const session = useSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.dutchPrice);
  return (
    <DataDisplay.Row label="Dutch price">
      <DataDisplay.TokenAmount
        symbol={token?.symbol}
        address={session?.tokenOutAddress}
        amount={amount}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const Transfers = () => {
  const { data: session } = useSession();
  const transfers = useTransfers().data;
  if (!transfers || !session) return null;

  return (
    <>
      <DataDisplay.Divider />
      <ExactAmountOut />
      <DucthPrice />
      <DataDisplay.Row label="ERC-20 Tokens Transferred">
        <StyledTransfers>
          {transfers?.map((transfer, index) => {
            return <Transfer key={index} log={transfer} />;
          })}
        </StyledTransfers>
      </DataDisplay.Row>
    </>
  );
};

const Transfer = ({ log }: { log: TransferLog }) => {
  const session = useSession().data;
  return (
    <StyledRow>
      <Typography>
        <strong>From </strong>
      </Typography>
      <AddressLink
        hideCopy
        chainId={session?.chainId}
        address={log.from}
        short
      />{" "}
      <Typography>
        <strong> To </strong>
      </Typography>
      <AddressLink hideCopy chainId={session?.chainId} address={log.to} short />{" "}
      <Typography>
        <strong>For</strong> <FormattedAmount value={log.value} />{" "}
      </Typography>
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
