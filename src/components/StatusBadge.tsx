import { swapStatusText } from "helpers";
import { styled } from "styled-components";
import { Check, X } from "react-feather";
import { Typography } from "antd";
import { CSSProperties } from "react";

const getBg = (swapStatus?: string) => {
  if (swapStatus === "success") return "#55a66c";
  if (swapStatus === "failed") return "red";
  return "transparent";
};

export const StatusBadge = ({
  swapStatus,
  className = "",
  style = {}
}: {
  swapStatus?: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <Container style={{ color: getBg(swapStatus), ...style }} className={className}>
      {swapStatusText(swapStatus)}
    </Container>
  );
};

export const MobileStatusBadge = ({
  swapStatus,
  className = "",
}: {
  swapStatus?: string;
  className?: string;
}) => {
  return (
    <MobileContainer
      style={{ background: getBg(swapStatus) }}
      className={className}
    >
      {swapStatus === "success" ? (
        <Check />
      ) : swapStatus === "failed" ? (
        <X />
      ) : null}
    </MobileContainer>
  );
};

const MobileContainer = styled("div")({
  padding: "5px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  svg: {
    color: "white",
    width: 14,
    height: 14,
  },
});

const Container = styled(Typography)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: {
    lineHeight: "normal",
  },
  span: {
    color: "white",
    fontSize: 12,
  },
});
