import {
  DataDisplay,
  Page,
  TxHashAddress,
  WalletAddress,
} from "components";
import { ColumnFlex, RowFlex } from "styles";
import styled from "styled-components";
import _ from "lodash";
import { Avatar, Typography } from "antd";
import { useOutTokenUsd, useTransfers } from "./hooks";
import {
  useAmountUI,
  useChainConfig,
  useLiquidityHubPartner,
  useNumberFormatter,
  useToken,
} from "hooks";
import { TransferLog } from "types";
import { SessionLogs } from "./components/Logs";
import { DebugComponent } from "./components/DebugComponent";
import moment from "moment";
import { StatusBadge } from "components/StatusBadge";
import { LogTrace } from "./components/LogTrace";
import { UserSavings } from "./components/UserSavings";
import { MOBILE } from "consts";
import { useLiquidityHubSession } from "applications";
import { useQuery } from "@tanstack/react-query";

export function TransactionPage() {
  const { data: session, isLoading: sessionLoading } = useLiquidityHubSession();

  const inToken = useToken(session?.tokenInAddress, session?.chainId);
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const isLoading = sessionLoading || !inToken || !outToken;

  return (
    <StyledPageLayout isLoading={isLoading}>
      {!session ? (
        <>
          <p>Session not found</p>
        </>
      ) : (
        <Content />
      )}
    </StyledPageLayout>
  );
}

const StyledPageLayout = styled(Page.Layout)({
  [`@media (max-width: ${MOBILE}px)`]: {
    // background:'transparent',
    // boxShadow: 'none',
  },
});

const SessionId = () => {
  const session = useLiquidityHubSession().data;

  return (
    <DataDisplay.Row label="Session ID">
      <Typography>{session?.id}</Typography>
    </DataDisplay.Row>
  );
};

const Network = () => {
  const session = useLiquidityHubSession().data;
  const config = useChainConfig(session?.chainId);
  const networkName = config?.name;
  const logo = config?.logoUrl;
  return (
    <DataDisplay.Row label="Network">
      <Avatar src={logo} style={{ width: "20px", height: "20px" }} />
      <Typography style={{ textTransform: "uppercase" }}>
        {networkName}
      </Typography>
    </DataDisplay.Row>
  );
};

const Content = () => {
  return (
    <DataDisplay>
      <Network />
      <Dex />
      <SessionId />

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
        <DexRouterData />
        <DexRouteTo />
      </DebugComponent>
    </DataDisplay>
  );
};

const Slippage = () => {
  const session = useLiquidityHubSession().data;
  return (
    <DataDisplay.Row
      label="SLIPPAGE"
      tooltip="The slippage user sets in the UI"
    >
      <Typography>{session?.slippage}%</Typography>
    </DataDisplay.Row>
  );
};

const Dex = () => {
  const session = useLiquidityHubSession().data;
  const partner = useLiquidityHubPartner(session?.dex);

  return (
    <DataDisplay.Row label="Dex">
      <RowFlex $gap={8}>
        <Avatar src={partner?.logoUrl} style={{ width: 20, height: 20 }} />
        <Typography>{session?.dex}</Typography>
      </RowFlex>
    </DataDisplay.Row>
  );
};
const User = () => {
  const session = useLiquidityHubSession().data;

  return (
    <DataDisplay.Row label="User's Address">
      <WalletAddress
        chainId={session?.chainId}
        address={session?.userAddress}
      />
    </DataDisplay.Row>
  );
};
const Timestamp = () => {
  const session = useLiquidityHubSession().data;

  const fromNow = useQuery({
    queryKey: ["fromNow", session?.id],
    queryFn: async () => {
      return moment(session?.timestamp).fromNow();
    },
    refetchInterval: 1_000,
  }).data;
  return (
    <DataDisplay.Row label="TIME">
      <RowFlex>
        <Typography>
          {fromNow}
          {` (${moment(session?.timestamp).format("lll")})`}
        </Typography>
      </RowFlex>
    </DataDisplay.Row>
  );
};

const InTokenAmount = () => {
  const session = useLiquidityHubSession().data;
  const token = useToken(session?.tokenInAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.amountIn);
  return (
    <DataDisplay.Row label="Amount In">
      <DataDisplay.TokenAmount
        amount={amount}
        address={session?.tokenInAddress}
        usd={session?.amountInUsd}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const Status = () => {
  const session = useLiquidityHubSession().data;

  return (
    <DataDisplay.Row label="STATUS">
      <StatusBadge style={{ fontSize: 12 }} swapStatus={session?.swapStatus} />
    </DataDisplay.Row>
  );
};
const TxHash = () => {
  const session = useLiquidityHubSession().data;
  return (
    <DataDisplay.Row label="TRANSACTION HASH">
      <TxHashAddress address={session?.txHash} chainId={session?.chainId} />
    </DataDisplay.Row>
  );
};

const ExpectedToReceiveLH = () => {
  const session = useLiquidityHubSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const amount = session?.lhAmountOutExpected;
  const amountF = useAmountUI(outToken?.decimals, amount);
  const usd = useOutTokenUsd(amountF);

  return (
    <DataDisplay.Row label="LH Amount Out (estimate)">
      <DataDisplay.TokenAmount
        amount={amountF}
        address={session?.tokenOutAddress}
        usd={usd as string}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const DexAmountOut = () => {
  const session = useLiquidityHubSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);

  const dexAmountOut = useAmountUI(
    outToken?.decimals,
    session?.dexAmountOutWSminusGas
  );
  const dexAmountOutUsd = useOutTokenUsd(dexAmountOut);
  const dexSimulatedAmountOut = useAmountUI(
    outToken?.decimals,
    session?.dexSimulateOutAmountMinusGas
  );
  const dexSimulatedAmountOutF = useNumberFormatter({
    value: dexSimulatedAmountOut,
    decimalScale: 8,
  }).formatted;

  return (
    <DataDisplay.Row
      label="Dex Amount Out (minus gas)"
      tooltip="The amount user would received via dex"
    >
      <DataDisplay.TokenAmount
        amount={dexAmountOut || "0"}
        address={session?.tokenOutAddress}
        usd={dexAmountOutUsd}
        chainId={session?.chainId}
        tooltipContent={
          !dexSimulatedAmountOut ? null : (
            <Typography>
              est. {dexSimulatedAmountOutF} {session?.tokenOutName}
            </Typography>
          )
        }
      />
    </DataDisplay.Row>
  );
};

const Fees = () => {
  const session = useLiquidityHubSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const fee = useAmountUI(outToken?.decimals, session?.feeOutAmount);

  return (
    <DataDisplay.Row label="Fees">
      <DataDisplay.TokenAmount
        address={outToken?.address}
        amount={fee as string}
        usd={session?.feeOutAmountUsd || '' as string}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const ExactAmountReceivedPreDeductions = () => {
  const session = useLiquidityHubSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(
    outToken?.decimals,
    session?.lhExactOutAmountPreDeduction
  );
  const usd = useOutTokenUsd(amount);

  return (
    <DataDisplay.Row label="LH Amount Out (actual pre deductions)">
      <DataDisplay.TokenAmount
        address={session?.tokenOutAddress}
        amount={amount as string}
        usd={usd as string}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const ExactAmountReceivedPostDeductions = () => {
  const session = useLiquidityHubSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(outToken?.decimals, session?.exactOutAmount);
  const usd = useOutTokenUsd(amount);

  return (
    <DataDisplay.Row label="LH Amount Out (actual post deductions)">
      <DataDisplay.TokenAmount
        address={session?.tokenOutAddress}
        amount={amount as string}
        usd={usd as string}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const ExactAmountOut = () => {
  const session = useLiquidityHubSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.exactOutAmount);
  return (
    <DataDisplay.Row label="Exact Amount Out">
      <DataDisplay.TokenAmount
        address={session?.tokenOutAddress}
        amount={amount}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const DexRouterData = () => {
  const session = useLiquidityHubSession().data;
  return (
    <DataDisplay.Row label="Dex router data">
      <Typography>{session?.dexRouteData}</Typography>
    </DataDisplay.Row>
  );
};

const DexRouteTo = () => {
  const session = useLiquidityHubSession().data;
  return (
    <DataDisplay.Row label="Dex route to">
      <Typography>{session?.dexRouteTo}</Typography>
    </DataDisplay.Row>
  );
};

const DucthPrice = () => {
  const session = useLiquidityHubSession().data;
  const token = useToken(session?.tokenOutAddress, session?.chainId);
  const amount = useAmountUI(token?.decimals, session?.dutchPrice);
  return (
    <DataDisplay.Row label="Dutch price">
      <DataDisplay.TokenAmount
        address={session?.tokenOutAddress}
        amount={amount}
        chainId={session?.chainId}
      />
    </DataDisplay.Row>
  );
};

const Transfers = () => {
  const { data: session } = useLiquidityHubSession();
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
  const session = useLiquidityHubSession().data;
  const value = useNumberFormatter({ value: log.value }).formatted?.toString()
  return (
    <StyledRow>
      <Typography style={{ whiteSpace: "nowrap" }}>
        <strong>From </strong>
      </Typography>
      <WalletAddress chainId={session?.chainId} address={log.from} />{" "}
      <Typography style={{ whiteSpace: "nowrap" }}>
        <strong> To </strong>
      </Typography>
      <WalletAddress chainId={session?.chainId} address={log.to} />{" "}
      <Typography style={{ whiteSpace: "nowrap" }}>
        <strong>For</strong> {value}{" "}
      </Typography>
      <WalletAddress chainId={session?.chainId} address={log.token.address} />
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
