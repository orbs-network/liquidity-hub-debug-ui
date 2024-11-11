import { Typography } from "antd";
import { AddressLink } from "components/AddressLink";
import { QuestionHelper } from "components/QuestionHelper";
import { useNumberFormatter } from "hooks";
import { ReactNode } from "react";
import { styled } from "styled-components";
import { ColumnFlex, RowFlex } from "styles";

const MainContainer = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 10px;
`;

export const Row = ({
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

const StyledRowChildren = styled.div`
  flex: 1;
  justify-content: flex-start;
  display: flex;
  gap: 5px;
`;


export const StyledDivider = styled.div`
  width: 100%;
  margin: 8px 0;
  height: 1px;
  background-color: #e8e8e8;
`;





const RowLabel = ({ label, tooltip }: { label: string; tooltip?: string }) => {
  return (
    <StyledRowLabel>
      {label} {tooltip && <QuestionHelper label={tooltip} />}
    </StyledRowLabel>
  );
};

export const TokenAmount = ({
  prefix,
  symbol,
  address,
  amount,
  usd,
  chainId,
}: {
  symbol?: string;
  address?: string;
  amount?: string | number;
  usd?: string | number;
  prefix?: string;
  chainId?: number;
}) => {
  const formattedAmount = useNumberFormatter({
    value: amount,
    decimalScale: 4,
  });
  
  const formattedUsd = useNumberFormatter({ value: usd, decimalScale: 2 });
  return (
    <RowFlex $gap={5}>
      <Typography>
        {prefix} {formattedAmount || "0"}
      </Typography>
      <AddressLink
        path="address"
        address={address}
        text={symbol || '-'}
        chainId={chainId}
      />
      {usd && (
        <Typography style={{ fontSize: 13, opacity: 0.8 }}>
          <small>{` ($${formattedUsd || "-"})`}</small>
        </Typography>
      )}
    </RowFlex>
  );
};

const DataDisplay = ({ children }: { children: ReactNode }) => {
  return <MainContainer>{children}</MainContainer>;
};


Row.Text = StyledRowText;
DataDisplay.Row = Row;
DataDisplay.TokenAmount = TokenAmount;
DataDisplay.Divider = StyledDivider;

export { DataDisplay };
