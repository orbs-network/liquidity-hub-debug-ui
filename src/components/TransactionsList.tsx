import styled from "styled-components";
import { RowFlex } from "../styles";
import { ROUTES } from "../config";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import {
  useChainConfig,
  useLiquidityHubPartner,
  useNumberFormatter,
} from "../hooks";
import { makeElipsisAddress, swapStatusText } from "../helpers";
import { AddressLink } from "./AddressLink";
import { useCallback } from "react";
import moment from "moment";
import { StatusBadge } from "./StatusBadge";
import { Button, Avatar } from "antd";
import { ChevronRight } from "react-feather";
import { List } from "./List";
import { LiquidityHubSwap } from "applications/clob/interface";

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
    navigate(ROUTES.navigate.tx(item.id));
  }, [navigate, item.id]);

  return (
    <StyledButtons>
      <Button
        aria-label="Done"
        style={{
          backgroundColor: "#f8f9fb",
          color: "#4a5568",
          border: "1px solid #e2e8f0",
          borderRadius: "50%",
        }}
        icon={<ChevronRight size={20} />}
        onClick={onNavigate}
      />
    </StyledButtons>
  );
};
const Timestamp = ({ item }: { item: LiquidityHubSwap }) => {
  return (
    <List.DesktopRow.Element.Text
      text={moment(item.timestamp).format("MMM D, h:mm A")}
    />
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
  const { tokenInName, tokenOutName, tokenInAddress, chainId } = item;
  return (
    <StyledTokens $gap={2}>
      <AddressLink
        path="address"
        chainId={chainId}
        text={tokenInName}
        address={tokenInAddress}
      />
      <ChevronRight size={10} />
      <AddressLink
        path="address"
        chainId={chainId}
        text={tokenOutName}
        address={tokenInAddress}
      />
    </StyledTokens>
  );
};

const StyledTokens = styled(RowFlex)({
  fontSize: 13,
  "*": {
    fontWeight: 400,
  },
});

const SessionId = ({ item }: { item: LiquidityHubSwap }) => {
  return (
    <Link to={ROUTES.navigate.tx(item.id)} style={{ textDecoration: "unset" }}>
      <List.DesktopRow.Element.Text text={item.id} />
    </Link>
  );
};

const TxHash = ({ item }: { item: LiquidityHubSwap }) => {
  const { txHash } = item;
  return (
    <>
      <Link to={ROUTES.navigate.tx(txHash)} style={{ textDecoration: "unset" }}>
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
  const result = useNumberFormatter({ value: dollarValue });

  return <List.DesktopRow.Element.Text text={result ? `$${result}` : "-"} />;
};

const StyledButtons = styled(RowFlex)`
  justify-content: flex-end;
  width: 100%;
`;

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
    label: "Date",
    width: 16,
  },
  {
    Component: Tokens,
    label: "Tokens",
    width: 16,
  },
  {
    Component: Usd,
    label: "USD",
    width: 10,
  },
  {
    Component: TxHash,
    label: "Tx hash",
    width: 13,
  },
  {
    Component: SwapStatus,
    label: "Status",
    width: 10,
    alignCenter: true,
  },
  {
    Component: GoButton,
    label: "Action",
    width: 5,
    alignCenter: true,
  },
];

const headerLabels = desktopRows.map((it) => {
  return {
    label: it.label,
    width: it.width,
    alignCenter: it.alignCenter,
  };
});

const MobileComponent = ({ item }: { item: LiquidityHubSwap }) => {
  const partner = useLiquidityHubPartner(item.dex);
  const navigate = useNavigate();
  const onClick = useCallback(
    () => {
      navigate(ROUTES.navigate.tx(item.id))
    },
    [navigate, item.id]
  );

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
        statusColor={item.swapStatus === "success" ? "#F0AD4E" :  item.swapStatus === 'failed' ?  "red" : undefined }
      />
    </MobileContainer>
  );
};

const MobileContainer = styled("div")({
  padding: "8px 0px",
  width: "100%",
});
