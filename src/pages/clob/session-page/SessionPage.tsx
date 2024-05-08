import { Tag, Text } from "@chakra-ui/react";
import {
  AddressLink,
  Card,
  FormattedAmount,
  LogModal,
  PageLoader,
} from "components";
import { ColumnFlex, RowFlex } from "styles";
import styled from "styled-components";
import _ from "lodash";
import {
  useLogTrace,
  useSession,
  useSessionChainConfig,
  useSessionTx,
} from "./hooks";
import { ReactNode, useMemo } from "react";
import { useNumberFormatter, useTokenAmountUsd } from "hooks";
import { formatNumber } from "helpers";
import { ClobSession, TransferLog } from "types";
import { eqIgnoreCase, zeroAddress } from "@defi.org/web3-candies";
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-terminal';

export function ClobSessionPage() {
  return (
    <Container>
      <Content />
    </Container>
  );
}

const Content = () => {
  const session = useSession();

  if (!session) {
    return <PageLoader />;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return <SessionDisplay session={session} />;
};
const SessionDisplay = ({ session }: { session: ClobSession }) => {
  return (
    <StyledSessionDisplay>
      <StyledList>
        <ListItem label="Timestamp">
          <WithSmallValue
            value={session.timestamp}
            smallValue={session.timeFromNow}
          />
        </ListItem>
        <ListItem label="Dex">
          <WithSmallValue value={session.dex} smallValue={session.chainId} />
        </ListItem>
        <ListItem label="Session ID">
          <StyledRowText>{session.id} </StyledRowText>
        </ListItem>
        <ListItem label="Transaction hash">
          {session.txHash ? (
            <AddressLink
              address={session.txHash}
              path="tx"
              chainId={session.chainId}
            />
          ) : (
            <StyledRowText>-</StyledRowText>
          )}
        </ListItem>
        <ListItem label="User address">
          <AddressLink address={session.userAddress} />
        </ListItem>
        <ListItem label="Slippage">
          <StyledRowText>{`${session.slippage}%`}</StyledRowText>
        </ListItem>
        <ListItem label="Auction winner">
          <StyledRowText>{session.auctionWinner}</StyledRowText>
        </ListItem>
        <OnChainStatus />
        <ListItem label="Action">
          <RowFlex $justifyContent="flex-start" $gap={5}>
            <span>
              Swap{" "}
              <WithUSD
                amount={session.amountInUI}
                address={session.tokenInAddress}
              />
            </span>
            <AddressLink
              address={session.tokenInAddress}
              text={session.tokenInSymbol}
            />
            <span>
              for{" "}
              <WithUSD
                amount={session.amountOutUI}
                address={session.tokenOutAddress}
              />
            </span>
            <AddressLink
              address={session.tokenOutAddress}
              text={session.tokenOutSymbol}
            />
          </RowFlex>
        </ListItem>

        <ListItem label="Dex vs LH amount out">
          <StyledRowText>
            <WithUSD
              amount={session.dexAmountOut}
              address={session.tokenOutAddress}
            />{" "}
            vs{" "}
            <WithUSD
              amount={session.amountOutUI}
              address={session.tokenOutAddress}
            />{" "}
            {"-->"}{" "}
            <WithSmallValue
              value="Diff"
              smallValue={`${formatNumber(session.amountOutDiff)}%`}
            />
          </StyledRowText>
        </ListItem>
        <ListItem label="Gas cost vs Estimated">
          <WithSmallValue
            value={session.gasCost}
            smallValue={session.gasCostUsd}
          />
        </ListItem>
        <ListItem label="User saving fee vs LH fee">
          <WithSmallValue
            value={session.gasCost}
            smallValue={session.gasCostUsd}
          />
        </ListItem>

        <Fees />
        <StyledDivider />
        <TxDetails />
        <Logs />
        <Transfers />
        <StyledDivider />
        <LogTrace />
      </StyledList>
    </StyledSessionDisplay>
  );
};

const LogTrace = () => {
  const {data, isLoading, error} = useLogTrace();

  return (
    <ListItem label="Log trace">
      <AceEditor
          mode="sh" // Set mode to shell script
          theme="terminal" // Set theme to a terminal-like theme
          value={isLoading ? 'Loading...' : error ? `Error: ${error}` :  data}
          readOnly={true} // Make it read-only to resemble a terminal output
          width="100%" // Adjust width as needed
          fontSize={18} // Set the font size here
      />
    </ListItem>
  );
};

const Fees = () => {
  const session = useSession();
  const { data: tx } = useSessionTx();

  const userSavingDstToken = useMemo(() => {
    return _.last(
      tx?.transfers?.filter(
        (it) =>
          eqIgnoreCase(it.from, session?.userAddress || "") ||
          eqIgnoreCase(it.to, session?.userAddress || "")
      )
    )?.value;
  }, [tx?.transfers]);

  return null;
};

const Amount = ({
  value,
  decimalScale,
  suffix = "",
  prefix = "",
}: {
  value?: string | number;
  decimalScale?: number;
  suffix?: string;
  prefix?: string;
}) => {
  const result = useNumberFormatter({ value, decimalScale });

  return <>{!result ? "-" : `${prefix}${result}${suffix}`}</>;
};

const Logs = () => {
  const session = useSession();
  if (!session || !session.logs) return null;
  return (
    <>
      <StyledDivider />
      {session.logs.client && (
        <ListItem label="Client logs">
          <StyledLogContent>
            {session.logs.client.map((it: any, index: number) => {
              return (
                <LogModal title={`Client ${index + 1}`} key={index} log={it} />
              );
            })}
          </StyledLogContent>
        </ListItem>
      )}
      {session.logs.quote && (
        <ListItem label="Quote logs">
          <StyledLogContent>
            {session.logs.quote.map((it: any, index: number) => {
              return (
                <LogModal title={`Quote ${index + 1}`} key={index} log={it} />
              );
            })}
          </StyledLogContent>
        </ListItem>
      )}
      {session.logs.swap && (
        <ListItem label="Swap logs">
          <StyledLogContent>
            {session.logs.swap.map((it: any, index: number) => {
              return (
                <LogModal title={`Swap ${index + 1}`} key={index} log={it} />
              );
            })}
          </StyledLogContent>
        </ListItem>
      )}
    </>
  );
};

const StyledLogContent = styled(RowFlex)`
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const OnChainStatus = () => {
  const tx = useSessionTx().data;

  return (
    <ListItem label="Onchain Status">
      {tx ? (
        <Tag>
          <StyledRowText>
            {tx.txStatus === "1" ? "Mined" : "Reverted"}
          </StyledRowText>
        </Tag>
      ) : (
        "-"
      )}
    </ListItem>
  );
};
const TxDetails = () => {
  const tx = useSessionTx().data;
  const session = useSession();
  if (!session) return null;

  return (
    <>
      <ListItem label="Block number">
        {tx ? <StyledRowText>{tx.blockNumber}</StyledRowText> : "-"}
      </ListItem>
      <ListItem label="Gas cost">
        <StyledRowText>
          <Amount value={session.gasCost} />
        </StyledRowText>
      </ListItem>
      <ListItem label="Gas cost Usd">
        <StyledRowText>
          $<Amount value={session.gasCostUsd} />
        </StyledRowText>
      </ListItem>
      <ListItem label="Gas units">
        <StyledRowText>{session.gasUnits}</StyledRowText>
      </ListItem>
    </>
  );
};

const GasUsed = () => {
  const tx = useSessionTx().data;
  const session = useSession();
  const usd = useTokenAmountUsd(
    zeroAddress,
    tx?.gasUsedNativeToken,
    session?.chainId
  );
  const gas = useNumberFormatter({ value: tx?.gasUsedNativeToken });
  const _usd = useNumberFormatter({ value: usd });
  const chainConfig = useSessionChainConfig();

  return (
    <ListItem label="Gas used">
      <WithSmallValue
        value={`${gas} ${chainConfig?.native.symbol}`}
        smallValue={`$${_usd}`}
      />
    </ListItem>
  );
};

// const Fees = () => {
//   const tx = useSessionTx().data;
//   const session = useSession();
//   const chainConfig = useSessionChainConfig();
//   const usd = useTokenAmountUsd(zeroAddress, tx?.fees, session?.chainId);
//   const fee = useNumberFormatter({ value: tx?.fees });
//   const _usd = useNumberFormatter({ value: usd });
//   return (
//     <ListItem label="Fee">
//       <WithSmallValue
//         value={`${fee} ${chainConfig?.native.symbol}`}
//         smallValue={`$${_usd}`}
//       />
//     </ListItem>
//   );
// };

const WithUSD = ({
  address,
  amount,
}: {
  address?: string;
  amount?: string | number;
}) => {
  const chainId = useSession()?.chainId;
  const _value = useNumberFormatter({ value: amount, decimalScale: 2 });
  const usd = useTokenAmountUsd(address, amount, chainId);
  const _usd = useNumberFormatter({ value: usd, decimalScale: 2 });

  if (!_value) {
    return <>-</>;
  }

  return <WithSmallValue value={_value} smallValue={`$${_usd}`} />;
};

const WithSmallValue = ({
  value,
  smallValue,
}: {
  value?: any;
  smallValue?: string | number | ReactNode;
}) => {
  if (!value) return null;
  return (
    <>
      {value}
      {smallValue && (
        <span className="small">
          {" ("}
          {smallValue}
          {")"}
        </span>
      )}
    </>
  );
};

const ExactAmountOut = () => {
  const tx = useSessionTx()?.data;
  const session = useSession();
  return (
    <ListItem label="Exact amount out">
      <WithUSD address={session?.tokenOutAddress} amount={tx?.exactAmountOut} />
    </ListItem>
  );
};

const DucthPrice = () => {
  const tx = useSessionTx()?.data;
  const session = useSession();
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
  const session = useSession();
  const { data: tx } = useSessionTx();

  if (!tx || !session) return null;

  return (
    <>
      <StyledDivider />
      <ExactAmountOut />
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
  .small {
    font-size: 12px;
    opacity: 0.7;
  }
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
