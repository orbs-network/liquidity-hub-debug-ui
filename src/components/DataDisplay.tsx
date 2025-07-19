import { QuestionHelper } from "@/components/QuestionHelper";
import { MOBILE } from "@/consts";
import { useAmountUI, useIsMobile, useToken } from "@/hooks";
import { ReactNode } from "react";
import { styled } from "styled-components";
import { ColumnFlex } from "@/styles";
import { TokenAddress } from "./AddressLink";
import { cn } from "@/lib/utils";
import { useFormatNumber } from "@/hooks/use-number-format";

const MainContainer = styled(ColumnFlex)`
  width: 100%;
  align-items: flex-start;
  gap: 15px;
`;

export const Row = ({
  label,
  children,
  tooltip,
  className,
}: {
  label: string;
  children?: ReactNode;
  tooltip?: string;
  className?: string;
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <StyledMobileListItem>
        <RowLabel tooltip={tooltip} label={label} />
        <div>{children}</div>
      </StyledMobileListItem>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-row justify-between w-full border-b border-border pb-2 mt-auto",
        className
      )}
    >
      <RowLabel tooltip={tooltip} label={label} />
      <div className="flex flex-row w-fit text-sm font-mono items-center">
        {children}
      </div>
    </div>
  );
};

const StyledMobileListItem = styled(ColumnFlex)({
  width: "100%",
  alignItems: "flex-start",
  borderBottom: "1px solid #e8e8e8",
  paddingBottom: 10,
  paddingTop: 5,
});

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
    <p className="text-sm font-bold text-secondary-foreground font-mono uppercase">
      {`${label}:`} {tooltip && <QuestionHelper label={tooltip} />}
    </p>
  );
};

export const FormattedTokenAmountFromWei = ({
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
  const value = useAmountUI(token?.decimals, amount);

  const amountF = useFormatNumber({
    value,
  });
  const usdF = useFormatNumber({ value: usd, decimalScale: 2 });

  return (
    <div className="flex flex-row gap-2">
      <p>
        {prefix} {amountF || "0"}
      </p>

      <TokenAddress
        address={address}
        name={token?.name}
        symbol={token?.symbol}
        chainId={chainId}
      />
      <p className="text-sm text-secondary-foreground font-mono">{` ($${
        usdF || "0"
      })`}</p>
    </div>
  );
};

const DataDisplay = ({ children }: { children: ReactNode }) => {
  return <MainContainer>{children}</MainContainer>;
};

DataDisplay.Row = Row;
DataDisplay.FormattedTokenAmountFromWei = FormattedTokenAmountFromWei;
DataDisplay.Divider = StyledDivider;

export { DataDisplay };
