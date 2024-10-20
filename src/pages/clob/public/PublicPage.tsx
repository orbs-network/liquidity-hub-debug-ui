import { Tag, Text } from "@chakra-ui/react";
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

import fantomLogo from "../../../assets/networks/fantom.png";
import bscLogo from "../../../assets/networks/bsc.png";
import polygonLogo from "../../../assets/networks/polygon.png";
import lineaLogo from "../../../assets/networks/linea.png";
import { useUSDPriceQuery } from "query";
import { BigNumber } from "@ethersproject/bignumber";

export function PublicPage() {
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

const Savings = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId);
  if (Number(session?.savings) <= 1) return <div>-</div>;

  const amountWithDecimals = amountUi(
    outToken?.data?.decimals,
    BN(session?.savings || "0")
  );
  const usdValue = useNumberFormatter({
    value: useTokenAmountUsd(session?.tokenOutAddress, 18, session?.chainId),
    decimalScale: 3,
  });
  //@ts-ignore
  return (
    <ListItem label="Savings">
      <span>{session?.savings}</span>
      <WithSmall
        value={useNumberFormatter({
          value: amountWithDecimals,
          decimalScale: 3,
        })}
        smallValue={`$${usdValue}`}
      />
    </ListItem>
  );
};

const Network = () => {
  const session = useSession().data;
  const networkName = useChainName(session?.chainId);
  const logo = useChainLogo(session?.chainId);
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

  const amountInUI = useNumberFormatter({ value: session.amountInUI });
  const amountInUSD = useNumberFormatter({
    value: session.amountInUSD,
    decimalScale: 0,
  });

  // const dexAmountOut = useNumberFormatter({ value: session.dexAmountOut, decimalScale: 2 });

  return (
    <StyledSessionDisplay>
      <StyledList>
        <Network />
        <ListItem label="Timestamp">
          <WithSmall
            value={session.timestamp}
            smallValue={session.timeFromNow}
          />
        </ListItem>
        <ListItem label="Transaction hash">
          <AddressLink
            address={session.txHash}
            text={makeElipsisAddress(session.txHash, 10)}
            path="tx"
            chainId={session.chainId}
          />
        </ListItem>
        <ListItem label="Dex">
          <StyledRowText>
            {session.dex} Chain ID: {session.chainId}
          </StyledRowText>
        </ListItem>
        <ListItem label="User's address">
          <AddressLink address={session.userAddress} />
        </ListItem>
        <ListItem label="Slippage">
          <StyledRowText>{session.slippage?.toFixed(2)}%</StyledRowText>
        </ListItem>
        {session.swapStatus && (
          <ListItem label="Swap status">
            <Tag>
              <StyledRowText>{session.txStatus}</StyledRowText>
            </Tag>
          </ListItem>
        )}
        <TxComparison />
        <TxSummary />

        <StyledDivider />
        <ListItem label="Amount in">
          <span>{amountInUI}</span>
          <span> (${amountInUSD})</span>
        </ListItem>
        <ListItem label="Amount out">
          <AmountOut
            amount={parseFloat(session.amountOutRaw!!).toFixed(2)}
            amountOutUSD={session.amountOutUSD}
          />
        </ListItem>
        <ListItem label="Dex amount out">
          <span>{Number(session.dexAmountOut).toFixed(2)}</span>
        </ListItem>
        <ListItem label="Amount out diff">
          <StyledRowText>{`${session.amountOutDiff}%`}</StyledRowText>
        </ListItem>
        <Savings />

        <StyledDivider />

        <TxDetails />
        {/* <Logs /> */}
        <Transfers />
      </StyledList>
    </StyledSessionDisplay>
  );
};

// const Logs = () => {
//   const session = useSession().data;
//   if (!session || !session.logs) return null;
//   return (
//     <>
//       <StyledDivider />
//       {session.logs.client && (
//         <ListItem label="Client logs">
//           <StyledLogContent>
//             {session.logs.client.map((it: any, index: number) => {
//               return (
//                 <LogModal title={`Client ${index + 1}`} key={index} log={it} />
//               );
//             })}
//           </StyledLogContent>
//         </ListItem>
//       )}
//       {session.logs.quote && (
//         <ListItem label="Quote logs">
//           <StyledLogContent>
//             {session.logs.quote.map((it: any, index: number) => {
//               return (
//                 <LogModal title={`Quote ${index + 1}`} key={index} log={it} />
//               );
//             })}
//           </StyledLogContent>
//         </ListItem>
//       )}
//       {session.logs.swap && (
//         <ListItem label="Swap logs">
//           <StyledLogContent>
//             {session.logs.swap.map((it: any, index: number) => {
//               return (
//                 <LogModal title={`Swap ${index + 1}`} key={index} log={it} />
//               );
//             })}
//           </StyledLogContent>
//         </ListItem>
//       )}
//     </>
//   );
// };

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
      <GasPrice />
    </>
  );
};

const GasPrice = () => {
  const session = useSession().data;
  const tx = useSessionTx().data;
  const chainConfig = useChainConfig(session?.chainId);
  const native = useNumberFormatter({ value: tx?.gasPrice });

  const gasUsedNative = useNumberFormatter({ value: tx?.gasUsedNativeToken });
  const nativePrice = useUSDPriceQuery(
    chainConfig?.native.address,
    session?.chainId
  );
  //const gasUsedNativeUSD = gasUsedNative!! * nativePrice!!;
  return (
    <ListItem label="Gas price">
      <WithSmall value={`${session?.gasPriceGwei} Gwei`} />

      <span>{`Gas Units:${session?.gasUsed}`}</span>
      <span>
        {`Transaction Fee: ${gasUsedNative} ${chainConfig?.native.symbol}`} $$
        {useNumberFormatter({ value: tx?.gasUsedNativeToken })}
      </span>
    </ListItem>
  );
};

const AmountOut = ({
  amount,
  amountOutUSD,
}: {
  amount?: string;
  amountOutUSD?: number;
}) => {
  return (
    <>
      <span>{`${amount}`}</span>
      <span>{`($${amountOutUSD})`}</span>
    </>
  );
};

const useLHAndDexAmountDiff = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId).data;

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

const TxComparison = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId).data;
  const lhAmount = useAmountUI(outToken?.decimals, session?.amountOutRaw);
  const dexAmount = useAmountUI(outToken?.decimals, session?.dexAmountOut);
  console.log({ dexAmount });

  const amountOutDiff = useLHAndDexAmountDiff();

  return (
    <ListItem label="Transaction Comparison">
      <RowFlex $justifyContent="flex-start" $gap={5}>
        <span>
          <TokenAmount
            prefix="LH Price:"
            amount={lhAmount}
            address={session?.tokenOutAddress}
            symbol={outToken?.symbol}
            usd={session?.amountOutUSD}
          />
        </span>
        <span>
          <TokenAmount
            prefix="Vs Dex price:"
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
      {prefix} {formattedAmount || "-"}{" "}
      <small style={{ fontSize: 13, opacity: 0.8 }}>
        {`($${formattedUsd || "-"})`}
      </small>
      <AddressLink
        path="address"
        address={address}
        text={symbol}
        chainId={session?.chainId}
      />
    </RowFlex>
  );
};

const TxSummary = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId).data;

  const amountOut = useAmountUI(outToken?.decimals, session?.amountOutRaw);

  const exactAmountOutF = parseFloat(
    amountUi(outToken?.decimals || 18, BN(session?.exactOutAmount || "0"))
  ).toFixed(2);

  const exactOutAmountUSD = useNumberFormatter({
    value: session?.exactOutAmountUsd,
    decimalScale: 0,
  });
  return (
    <ListItem label="Transaction Action">
      <RowFlex $justifyContent="flex-start" $gap={5}>
        <TokenAmount
          address={session?.tokenInAddress}
          prefix="Swap"
          usd={session?.amountInUSD}
          amount={session?.amountInUI}
          symbol={session?.tokenInSymbol}
        />
        for
        <TokenAmount
          prefix="For"
          amount={amountOut}
          usd={session?.amountOutUSD}
          address={session?.tokenOutAddress}
          symbol={outToken?.symbol}
        />
        Exact:
        <span>{`${exactAmountOutF}`} </span>
        <span>{`($${exactOutAmountUSD})`}</span>
        Gas:
        <span>{`${session?.gasPriceGwei} Gwei`}</span>
        <span>{`${session?.gasUsed ?? "N/A"}`}</span>
      </RowFlex>
    </ListItem>
  );
};

const ExactAmountReceived = () => {
  const session = useSession().data;
  const outToken = useToken(session?.tokenOutAddress, session?.chainId).data;
  const amountOut = useAmountUI(outToken?.decimals, session?.exactOutAmount);
  const amountOutUSD = useNumberFormatter({
    value: session?.amountOutUSD,
    decimalScale: 0,
  });

  return (
    <ListItem label="Exact Amount Received">
      <StyledRowText></StyledRowText>
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

const networkNames = {
  1: "Mainnet",
  56: "BSC",
  137: "Polygon",
  8453: "Base",
  84532: "Base Sepolia",
  59144: "Linea",
  59145: "Linea Sepolia",
  10: "Optimism",
  42161: "Arbitrum",
  43114: "Avalanche",
  1101: "ZkSync",
  11010: "ZkSync Testnet",
  10000: "Gnosis",
  10001: "Gnosis Testnet",
  250: "Fantom",
};

function useChainName(chainId: number | undefined) {
  const n = networkNames[chainId as keyof typeof networkNames];
  return n;
}

const chainLogos = {
  56: bscLogo,
  137: polygonLogo,
  59144: lineaLogo,
  250: fantomLogo,
};

export function useChainLogo(chainId: number | undefined) {
  const logo = chainLogos[chainId as keyof typeof chainLogos];
  return logo;
}
