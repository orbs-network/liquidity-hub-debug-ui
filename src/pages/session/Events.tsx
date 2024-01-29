import { Text } from "@chakra-ui/react";
import _ from "lodash";
import { useNumericFormat } from "react-number-format";
import styled from "styled-components";
import { AddressLink } from "../../components";
import { useTxDetailsQuery } from "../../query";
import { ColumnFlex } from "../../styles";
import { useSession } from "./hooks";

export const SessionEvents = () => {
  const { data: session } = useSession();

  const data = useTxDetailsQuery(session).data;

  console.log(_.size(data));

  if (!data) return null;

  return (
    <Container>
      {data.map((it, index) => {
        return (
          <StyledText key={index}>
            <strong>From </strong>
            <AddressLink
              chainId={session?.chainId}
              address={it.fromAddress}
            />{" "}
            <strong> To </strong>
            <AddressLink
              chainId={session?.chainId}
              address={it.toAddress}
            />{" "}
            <strong>For</strong> <Amount value={it.tokenAmount} />{" "}
            <AddressLink
              chainId={session?.chainId}
              address={it.tokenAddress}
              text={it.tokenSymbol}
            />
          </StyledText>
        );
      })}
    </Container>
  );
};

const Container = styled(ColumnFlex)`

`;

const StyledText = styled(Text)`
  width: 100%;
  text-align: left;
  font-size: 15px;
  strong {
    font-weight: 600;
  }
`;

const Amount = ({ value }: { value: string }) => {
  const res = useNumericFormat({
    value,
    decimalScale: 5,
    thousandSeparator: true,
  });

  return <span>{res.value}</span>;
};
