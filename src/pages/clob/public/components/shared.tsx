import { Text } from "@chakra-ui/layout";
import { useNumberFormatter, useTokenAmountUsd } from "hooks";
import { ReactNode } from "react";
import styled from "styled-components";
import { RowFlex } from "styles";
import { useSession } from "../hooks";

export const StyledDivider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  margin: 8px 0;
`;

const StyledListItem = styled(RowFlex)`
  gap: 10px;
  width: 100%;
  font-size: 14px;
  align-items: flex-start;
`;

const StyledRowLabel = styled(Text)`
  width: 240px;
  padding-right: 20px;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-weight: 500;
  font-size: 14px;
`;

export const StyledRowText = styled(Text)`
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
  justify-content: flex-start;
  display: flex;
`;

const RowLabel = ({ label }: { label: string }) => {
  return <StyledRowLabel>{label}:</StyledRowLabel>;
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

  export const WithUSD = ({
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
  