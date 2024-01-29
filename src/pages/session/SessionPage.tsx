import { Link, List, ListItem, Text } from "@chakra-ui/react";
import { PageLoader } from "../../components";
import { useTxDetailsQuery } from "../../query";
import { ColumnFlex } from "../../styles";
import styled from "styled-components";
import { getExplorer } from "../../helpers";
import { numericFormatter } from "react-number-format";
import _ from "lodash";
import { Logs } from "./Logs";
import { useSession } from "./hooks";
import { SessionEvents } from "./Events";

type ElementType = "tx" | "text" | "numeric" | "link" | "address";

export function SessionPage() {
  return (
    <Container>
      <Content />
    </Container>
  );
}

const Content = () => {
  const { data: session, isLoading } = useSession();
  console.log({ session });
  const data = useTxDetailsQuery(session).data;
  console.log({ data });

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
      <List spacing={3}>
        <Row label="Dex" value={session.dex} type="text" />
        <Row label="Session ID" value={session.id} type="text" />
        <Row
          label="Wallet address"
          value={session.userAddress}
          type="address"
        />
        <Row
          label="In token address"
          value={session.tokenInAddress}
          type="address"
        />
        <Row
          label="Out token address"
          value={session.tokenOutAddress}
          type="address"
        />

        <Row
          label="In token symbol"
          value={session.tokenInSymbol}
          type="text"
        />
        <Row
          label="Out token symbol"
          value={session.tokenOutSymbol}
          type="text"
        />

        <Row label="Amount in" value={session.amountInUI} type="numeric" />
        <Row label="Amount out" value={session.amountOutUI} type="numeric" />
        <Row label="Chain ID" value={session.chainId} type="text" />
        <Row label="Slippage" value={session.slippage} type="text" />
        <Row label="Transaction hash" value={session.txHash} type="tx" />
        <Row label="Amount in USD" value={session.amountInUSD} type="numeric" />
        <Row
          label="Amount out USD"
          value={session.amountOutUSD}
          type="numeric"
        />
        <Row label="Swap status" value={session.swapStatus} type="text" />
      </List>
      <Logs session={session} />
      <SessionEvents />
    </StyledSessionDisplay>
  );
};

const StyledSessionDisplay = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 20px;
`;

const Row = ({
  type,
  label,
  value,
}: {
  type: ElementType;
  label: string;
  value?: string | number;
}) => {
  const chainId = useSession().data?.chainId;

  const renderComponent = () => {
    if (!value) return null;
    switch (type) {
      case "tx":
      case "address":
        const explorer = getExplorer(chainId);
        const path = type === "tx" ? "tx" : "address";
        return (
          <Link target="_blank" href={`${explorer}/${path}/${value}`}>
            {value}
          </Link>
        );
      case "text":
        return <>{value}</>;
      case "numeric":
        return (
          <>
            {numericFormatter(_.isNumber(value) ? value.toString() : value, {
              decimalScale: 4,
              thousandSeparator: ",",
            })}
          </>
        );
    }
  };

  return (
    <StyledListItem>
      <StyledRowText>
        <strong>{label}: </strong>
        {renderComponent()}
      </StyledRowText>
    </StyledListItem>
  );
};

const StyledRowText = styled(Text)`
  white-space: wrap;
  line-break: anywhere;
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  gap: 10px;
`;

const Container = styled(ColumnFlex)`
  gap: 20px;
`;
