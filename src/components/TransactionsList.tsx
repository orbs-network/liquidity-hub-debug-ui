import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useNumberFormatter } from "../hooks";
import { makeElipsisAddress } from "../helpers";
import { TokenAddress } from "./AddressLink";
import { useCallback, useMemo } from "react";
import moment from "moment";
import { Avatar } from "antd";
import { ChevronRight } from "react-feather";
import { LiquidityHubSwap } from "@/applications/clob/interface";
import { colors } from "@/consts";
import { navigation } from "@/utils";
import { useNetwork } from "@/hooks/hooks";
import _ from "lodash";
import { useLiquidityHubSwaps } from "@/lib/queries/use-liquidity-hub-swaps";
import { VirtualTable } from "./virtual-table";



const GoButton = ({ item }: { item: LiquidityHubSwap }) => {
  const navigate = useNavigate();

  const onNavigate = useCallback(() => {
    navigate(navigation.liquidityHub.tx(item.id));
  }, [navigate, item.id]);

  return (
    <StyledButton onClick={onNavigate}>
      <ChevronRight size={20} />
    </StyledButton>
  );
};
const Timestamp = ({ item }: { item: LiquidityHubSwap }) => {
  return <p>{moment(item.timestamp).fromNow()}</p>;
};

const Dex = ({ item }: { item: LiquidityHubSwap }) => {
  const chainConfig = useNetwork(item.chainId);
  return (
    <div className="flex gap-1 items-center text-sm">
      {item.dex}
      <Avatar src={chainConfig?.logoUrl} size={23} />
    </div>
  );
};

const Tokens = ({ item }: { item: LiquidityHubSwap }) => {
  const {
    tokenInName,
    tokenOutName,
    tokenInAddress,
    chainId,
    tokenOutAddress,
  } = item;

  return (
    <div className="flex gap-1 items-center text-sm">
      <TokenAddress
        address={tokenInAddress}
        symbol={tokenInName}
        chainId={chainId}
      />
      <ChevronRight size={10} />
      <TokenAddress
        address={tokenOutAddress}
        symbol={tokenOutName}
        chainId={chainId}
      />
    </div>
  );
};

const SessionId = ({ item }: { item: LiquidityHubSwap }) => {
  return (
    <Link
      to={navigation.liquidityHub.tx(item.id)}
      style={{ textDecoration: "unset" }}
    >
      {item.id}
    </Link>
  );
};

const TxHash = ({ item }: { item: LiquidityHubSwap }) => {
  const { txHash } = item;
  return (
    <>
      <Link
        to={navigation.liquidityHub.tx(txHash)}
        style={{ textDecoration: "unset" }}
      >
        {makeElipsisAddress(txHash) || ""}
      </Link>
    </>
  );
};

const Usd = ({ item }: { item: LiquidityHubSwap }) => {
  const { dollarValue } = item;
  const result = useNumberFormatter({ value: dollarValue }).short;

  return result ? `$${result}` : "-";
};

const FeesUsd = ({ item }: { item: LiquidityHubSwap }) => {
  const { feeOutAmountUsd } = item;
  const result = useNumberFormatter({ value: feeOutAmountUsd || "" }).short;

  return result ? `$${result}` : "-";
};

const StyledButton = styled("button")`
  background: none;
  border: none;
  cursor: pointer;
  background: ${colors.dark.inputBg};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  svg {
    color: ${colors.dark.textMain};
    width: 20px;
    height: 20px;
  }
`;

const desktopRows = [
  {
    Component: Dex,
    text: "Dex",
  },
  {
    Component: SessionId,
    text: "Session id",
    },
  {
    Component: Timestamp,
    text: "Time",
  },
  {
    Component: Tokens,
    text: "Tokens",
  },
  {
    Component: Usd,
    text: "USD",
  },
  {
    Component: FeesUsd,
    text: "Fees",
  },
  {
    Component: TxHash,
    text: "Tx hash",
  },

  {
    Component: GoButton,
    text: "Action",
  },
];

const headerLabels = _.map(desktopRows, (row) => ({
  text: row.text,
}));

export const TransactionsList = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useLiquidityHubSwaps();

  const sessions = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);

  return (
    <VirtualTable<LiquidityHubSwap>
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      tableItems={sessions}
      headerLabels={headerLabels}
      desktopRows={desktopRows}
    />
  );
};

// const MobileComponent = ({ item }: { item: LiquidityHubSwap }) => {
//   const partner = usePartnerWithId(item.dex);
//   const navigate = useNavigate();
//   const onClick = useCallback(() => {
//     navigate(navigation.liquidityHub.tx(item.id));
//   }, [navigate, item.id]);

//   return (
//     <MobileContainer onClick={onClick}>
//       <List.MobileRow
//         partner={partner?.name || item.dex}
//         chainId={item.chainId}
//         inToken={item.tokenInName}
//         outToken={item.tokenOutName}
//         usd={item.dollarValue}
//         timestamp={item.timestamp}
//         status={swapStatusText(item.swapStatus)}
//         statusColor={
//           item.swapStatus === "success"
//             ? "#F0AD4E"
//             : item.swapStatus === "failed"
//             ? "red"
//             : undefined
//         }
//       />
//     </MobileContainer>
//   );
// };

const MobileContainer = styled("div")({
  padding: "8px 0px",
  width: "100%",
});
