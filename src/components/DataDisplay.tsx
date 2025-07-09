import { Tooltip, Typography } from "antd";
import { QuestionHelper } from "@/components/QuestionHelper";
import { colors, MOBILE } from "@/consts";
import {
  useIsMobile,
  useNumberFormatter,
  useToken,
  useTokenValueFormatter,
} from "@/hooks";
import { ReactNode } from "react";
import { styled } from "styled-components";
import { ColumnFlex, RowFlex } from "@/styles";
import { TokenAddress } from "./AddressLink";

const MainContainer = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 15px;
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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <StyledMobileListItem>
        <RowLabel tooltip={tooltip} label={label} />
        <StyledRowChildren>{children}</StyledRowChildren>
      </StyledMobileListItem>
    );
  }

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
  .ant-typography {
    white-space: wrap;
    line-break: anywhere;
    font-size: 13px;
  }
`;

const StyledMobileListItem = styled(ColumnFlex)({
  width: "100%",
  alignItems: "flex-start",
  borderBottom: "1px solid #e8e8e8",
  paddingBottom: 10,
  paddingTop: 5,
});

const StyledRowLabel = styled(Typography)`
  width: 310px;
  text-transform: uppercase;
  @media (max-width: ${MOBILE}px) {
    font-weight: 600;
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
  border: 0.5px solid hsla(0, 0%, 100%, 0.2);
  @media (max-width: ${MOBILE}px) {
    display: none;
  }
`;

const RowLabel = ({ label, tooltip }: { label: string; tooltip?: string }) => {
  return (
    <StyledRowLabel style={{ fontSize: 13 }}>
      {`${label}:`} {tooltip && <QuestionHelper label={tooltip} />}
    </StyledRowLabel>
  );
};

export const TokenAmount = ({
  prefix,
  address,
  amount,
  usd,
  chainId,
  tooltipContent,
}: {
  address?: string;
  amount?: string | number;
  usd?: string | number;
  prefix?: string;
  chainId?: number;
  tooltipContent?: ReactNode;
}) => {
  const token = useToken(address, chainId).data;

  const amountF = useTokenValueFormatter({
    value: amount,
    tokenDecimals: token?.decimals,
  });
  const usdF = useNumberFormatter({ value: usd, decimalScale: 2 });
  const fullValue = useNumberFormatter({
    value: amount,
    decimalScale: 8,
  }).formatted;

  return (
    <StyledTokenAmount>
      <Tooltip
        title={tooltipContent || `${fullValue} ${token?.symbol}`}
        placement="right"
      >
        <Typography>
          {prefix} {amountF.short || "0"}
        </Typography>
      </Tooltip>

      <TokenAddress
        address={address}
        name={token?.name}
        symbol={token?.symbol}
        chainId={chainId}
      />
       <StyledUsd>{` ($${usdF.short || "0"})`}</StyledUsd>
    </StyledTokenAmount>
  );
};

const StyledUsd = styled(Typography)({
  color: colors.dark.textSecondary,
  fontSize: 12,
});

const StyledTokenAmount = styled(RowFlex)({
  gap: 5,
});

const DataDisplay = ({ children }: { children: ReactNode }) => {
  return <MainContainer>{children}</MainContainer>;
};

DataDisplay.Row = Row;
DataDisplay.TokenAmount = TokenAmount;
DataDisplay.Divider = StyledDivider;

export { DataDisplay };
