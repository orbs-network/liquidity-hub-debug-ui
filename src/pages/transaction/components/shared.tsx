import { AddressLink, QuestionHelper } from "components";
import { useNumberFormatter } from "hooks";
import { ReactNode } from "react";
import styled from "styled-components";
import { RowFlex } from "styles";
import { useSession } from "../hooks";
import { Typography } from "antd";

export const StyledDivider = styled.div`
  width: 100%;
  margin: 8px 0;
  height: 1px;
  background-color: #e8e8e8;
`;

const StyledListItem = styled(RowFlex)`
  gap: 40px;
  width: 100%;
  font-size: 14px;
  align-items: flex-start;
`;

const StyledRowLabel = styled(Typography)`
  max-width: 280px;
  flex: 1;
  padding-right: 20px;
  font-weight: 500;
  font-size: 14px;
`;

export const StyledRowText = styled(Typography)`
  white-space: wrap;
  line-break: anywhere;
  font-size: 14px;
  small {
    opacity: 0.7;
    font-size: 13px;
  }
`;

export const ListItem = ({
  label,
  children,
  tooltip,
}: {
  label: string;
  children?: ReactNode;
  tooltip?: string;
}) => {
  return (
    <StyledListItem>
      <RowLabel tooltip={tooltip} label={label} />
      <StyledRowChildren>{children}</StyledRowChildren>
    </StyledListItem>
  );
};

const StyledRowChildren = styled.div`
  flex: 1;
  justify-content: flex-start;
  display: flex;
`;

const RowLabel = ({ label, tooltip }: { label: string; tooltip?: string }) => {
  return (
    <StyledRowLabel>
      {label} {tooltip && <QuestionHelper label={tooltip} />}
    </StyledRowLabel>
  );
};

export const WithSmall = ({
  value,
  smallValue,
}: {
  value?: any;
  smallValue?: string | number;
}) => {
  if (!value) return null;
  return (
    <StyledRowText>
      {value}
      {smallValue && <small>{` (${smallValue})`}</small>}
    </StyledRowText>
  );
};

export const TokenAmount = ({
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
    decimalScale: 4,
  });
  const formattedUsd = useNumberFormatter({ value: usd, decimalScale: 2 });
  return (
    <RowFlex $gap={5}>
      <Typography>
        {prefix} {formattedAmount || "-"}
      </Typography>
      <AddressLink
        path="address"
        address={address}
        text={symbol}
        chainId={session?.chainId}
      />
      {formattedUsd && (
        <Typography style={{ fontSize: 13, opacity: 0.8 }}>
          <small>
          {` ($${formattedUsd || "-"})`}
          </small>
        </Typography>
      )}
    </RowFlex>
  );
};
