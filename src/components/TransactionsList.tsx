import styled from "styled-components";
import { RowFlex, StyledInput } from "../styles";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import {
  useAppParams,
  useChainConfig,
  useDebounce,
  useLiquidityHubPartner,
  useNumberFormatter,
} from "../hooks";
import { makeElipsisAddress, swapStatusText } from "../helpers";
import { TokenAddress } from "./AddressLink";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { StatusBadge } from "./StatusBadge";
import { Avatar } from "antd";
import { ChevronRight } from "react-feather";
import { List } from "./List";
import { LiquidityHubSwap } from "applications/clob/interface";
import { colors } from "consts";
import { navigation } from "utils";

export const TransactionsList = ({
  sessions = [],
  loadMore,
  isFetchingNextPage,
  isLoading,
}: {
  sessions?: LiquidityHubSwap[];
  loadMore: () => void;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
}) => {
  return (
    <List<LiquidityHubSwap>
      isLoading={isLoading}
      loadMore={loadMore}
      isFetchingNextPage={isFetchingNextPage}
      items={sessions}
      DesktopComponent={DesktopComponent}
      MobileComponent={MobileComponent}
      headerLabels={headerLabels}
    />
  );
};

const DesktopComponent = ({ item }: { item: LiquidityHubSwap }) => {
  return (
    <List.DesktopRow>
      {desktopRows.map((it) => {
        return (
          <List.DesktopRow.Element
            key={it.label}
            alignCenter={it.alignCenter}
            width={it.width}
          >
            <it.Component item={item} />
          </List.DesktopRow.Element>
        );
      })}
    </List.DesktopRow>
  );
};

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
  return (
    <RowFlex>
      <List.DesktopRow.Element.Text text={moment(item.timestamp).fromNow()} />
    </RowFlex>
  );
};

const Dex = ({ item }: { item: LiquidityHubSwap }) => {
  const chainConfig = useChainConfig(item.chainId);
  return (
    <RowFlex style={{ gap: 6 }}>
      <List.DesktopRow.Element.Text text={item.dex} />
      <Avatar src={chainConfig?.logoUrl} size={23} />
    </RowFlex>
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
    <StyledTokens $gap={2}>
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
    </StyledTokens>
  );
};

const StyledTokens = styled(RowFlex)({
  svg: {
    color: colors.dark.textMain,
  },
});

const SessionId = ({ item }: { item: LiquidityHubSwap }) => {
  return (
    <Link
      to={navigation.liquidityHub.tx(item.id)}
      style={{ textDecoration: "unset" }}
    >
      <List.DesktopRow.Element.Text text={item.id} />
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
        <List.DesktopRow.Element.Text text={makeElipsisAddress(txHash) || ""} />
      </Link>
    </>
  );
};

const SwapStatus = ({ item }: { item: LiquidityHubSwap }) => {
  return <StatusBadge swapStatus={item.swapStatus} />;
};

const Usd = ({ item }: { item: LiquidityHubSwap }) => {
  const { dollarValue } = item;
  const result = useNumberFormatter({ value: dollarValue }).short;

  return <List.DesktopRow.Element.Text text={result ? `$${result}` : "-"} />;
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

const MinDollarValueFilter = () => {
  const { setQuery, query } = useAppParams();

  const [value, setValue] = useState(query.minDollarValue?.toString() || '');

  const minDollarValue = useDebounce(value, 500);

  useEffect(() => {
    setQuery({ minDollarValue: minDollarValue ? Number(minDollarValue) : undefined });
  }, [setQuery, minDollarValue]);

  return (
    <span>
      <StyledInput value={value} onChange={(e) => setValue(e.target.value)} />
    </span>
  );
};

const desktopRows = [
  {
    Component: Dex,
    label: "Dex",
    width: 16,
  },
  {
    Component: SessionId,
    label: "Session id",
    width: 13,
  },
  {
    Component: Timestamp,
    label: "Time",
    width: 16,
  },
  {
    Component: Tokens,
    label: "Tokens",
    width: 15,
  },
  {
    Component: Usd,
    label: "USD",
    width: 10,
    filterComponent: <MinDollarValueFilter />,
  },
  {
    Component: TxHash,
    label: "Tx hash",
    width: 15,
  },
  {
    Component: SwapStatus,
    label: "Status",
    width: 12,
    alignCenter: true,
  },
  {
    Component: GoButton,
    label: "Action",
    width: 4,
    alignCenter: true,
  },
];

const headerLabels = desktopRows.map((it) => {
  return {
    label: it.label,
    width: it.width,
    alignCenter: it.alignCenter,
    filterComponent: it.filterComponent,
  };
});

const MobileComponent = ({ item }: { item: LiquidityHubSwap }) => {
  const partner = useLiquidityHubPartner(item.dex);
  const navigate = useNavigate();
  const onClick = useCallback(() => {
    navigate(navigation.liquidityHub.tx(item.id));
  }, [navigate, item.id]);

  return (
    <MobileContainer onClick={onClick}>
      <List.MobileRow
        partner={partner?.name || item.dex}
        chainId={item.chainId}
        inToken={item.tokenInName}
        outToken={item.tokenOutName}
        usd={item.dollarValue}
        timestamp={item.timestamp}
        status={swapStatusText(item.swapStatus)}
        statusColor={
          item.swapStatus === "success"
            ? "#F0AD4E"
            : item.swapStatus === "failed"
            ? "red"
            : undefined
        }
      />
    </MobileContainer>
  );
};

const MobileContainer = styled("div")({
  padding: "8px 0px",
  width: "100%",
});
