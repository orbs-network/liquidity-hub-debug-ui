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
import { useSession, useSessionChainConfig, useSessionTx } from "./hooks";
import { ReactNode } from "react";
import { useNumberFormatter, useTokenAmountUsd } from "hooks";
import { swapStatusText } from "helpers";
import { ClobSession, TransferLog } from "types";
import { zeroAddress } from "@defi.org/web3-candies";

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
        <ListItem label="User address">
          <AddressLink address={session.userAddress} />
        </ListItem>
        <ListItem label="Slippage">
          <StyledRowText>{`${session.slippage}%`}</StyledRowText>
        </ListItem>
        <ListItem label="Auction winner">
          <StyledRowText>{session.auctionWinner}</StyledRowText>
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

        <ListItem label="Amount in">
          <WithUSD
            amount={session.amountInUI}
            address={session.tokenInAddress}
          />
        </ListItem>
        <ListItem label="Amount out">
          <WithUSD
            amount={session.amountOutUI}
            address={session.tokenOutAddress}
          />
        </ListItem>
        <ListItem label="Dex amount out">
          <StyledRowText>
            <FormattedAmount value={session.dexAmountOut} />
          </StyledRowText>
        </ListItem>
        <ListItem label="Amount out diff">
          <StyledRowText>
            <Amount suffix="%" value={session.amountOutDiff} decimalScale={2} />
          </StyledRowText>
        </ListItem>
        
        <StyledDivider />

        <ListItem label="Timestamp">
          <WithSmall
            value={session.timestamp}
            smallValue={session.timeFromNow}
          />
        </ListItem>
        <TxDetails />
        <Logs />
        <Transfers />
      </StyledList>
    </StyledSessionDisplay>
  );
};

const Amount = ({
  value,
  decimalScale,
  suffix = '' ,
  prefix = ''
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
  const session = useSession().data;
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
const TxDetails = () => {
  const tx = useSessionTx().data;
  const session = useSession().data;
  if (!session) return null;
  
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
      <ListItem label="Block number">
        {tx ? <StyledRowText>{tx.blockNumber}</StyledRowText> : "-"}
      </ListItem>
      <ListItem label="Gas cost">
      <StyledRowText>
        <Amount value={session.gasCost} /></StyledRowText> 
      </ListItem>
      <ListItem label="Gas cost Usd">
      <StyledRowText>$<Amount value={session.gasCostUsd} /></StyledRowText> 
      </ListItem>
      <ListItem label="Gas units">
      <StyledRowText>{session.gasUnits}</StyledRowText> 
      </ListItem>
    </>
  );
};

// const GasPrice = () => {
//   const tx = useSessionTx().data;
  
//   const value = useNumberFormatter({ value: tx?.gasUsed });
//   return (
//     <ListItem label="Gas price">
//       <StyledRowText>{value} Gwei</StyledRowText>
//     </ListItem>
//   );
// };

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
  const chainConfig = useSessionChainConfig();

  return (
    <ListItem label="Gas used">
      <WithSmall
        value={`${gas} ${chainConfig?.native.symbol}`}
        smallValue={`$${_usd}`}
      />
    </ListItem>
  );
};

const Fees = () => {
  const tx = useSessionTx().data;
  const session = useSession().data;
  const chainConfig = useSessionChainConfig();
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

const WithUSD = ({
  decimalScale,
  address,
  amount,
}: {
  address?: string;
  decimalScale?: number;
  amount?: string | number;
}) => {
  const chainId = useSession().data?.chainId;
  const _value = useNumberFormatter({ value: amount, decimalScale });
  const usd = useTokenAmountUsd(address, amount, chainId);
  const _usd = useNumberFormatter({ value: usd });

  if (!_value) {
    return <StyledRowText>-</StyledRowText>;
  }

  return <WithSmall value={_value} smallValue={`$${_usd}`} />;
};

const WithSmall = ({
  value,
  smallValue,
}: {
  value?: any;
  smallValue?: string;
}) => {
  if (!value) return null;
  return (
    <StyledRowText>
      {value}
      {smallValue && <small>{` (${smallValue})`}</small>}
    </StyledRowText>
  );
};

const ExactAmountOut = () => {
  const tx = useSessionTx()?.data;
  const session = useSession().data;
  return (
    <ListItem label="Exact amount out">
      <WithUSD address={session?.tokenOutAddress} amount={tx?.exactAmountOut} />
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

  if (!tx || !session)  return null;

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
