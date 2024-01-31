import { Tag, Text } from "@chakra-ui/react";
import _ from "lodash";
import styled from "styled-components";
import { AddressLink } from "../../components";
import { FormattedAmount } from "../../components/FormattedAmount";
import { useTxDetailsQuery } from "../../query";
import { ColumnFlex, RowFlex } from "../../styles";
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
          <StyledRow key={index}>
            <strong>From </strong>
            <AddressLink
              chainId={session?.chainId}
              address={it.fromAddress}
              short
            />{" "}
            <strong> To </strong>
            <AddressLink
              chainId={session?.chainId}
              address={it.toAddress}
              short
            />{" "}
            <strong>For</strong> <FormattedAmount value={it.tokenAmount} />{" "}
            <Tag>
              <StyledUsd>
                $<FormattedAmount value={it.priceUsd} />
              </StyledUsd>
            </Tag>
            <AddressLink
              chainId={session?.chainId}
              address={it.tokenAddress}
              text={it.tokenSymbol}
            />
          </StyledRow>
        );
      })}
    </Container>
  );
};

const StyledRow = styled(RowFlex)`
    justify-content: flex-start;
    width: 100%;
`

const StyledUsd = styled(Text)`
  font-size: 12px;
  font-weight: 600;
`;

const Container = styled(ColumnFlex)`
  width: 100%;
`;

const StyledText = styled(Text)`
  display: flex;
  gap: 5px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  strong {
    font-weight: 600;
  }
`;
