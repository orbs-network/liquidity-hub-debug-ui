import { swapStatusText } from "helpers";
import { Typography } from "antd";

import { styled } from "styled-components";

export const StatusBadge = ({ swapStatus }: { swapStatus?: string }) => {
  const background =
    swapStatus === "success"
      ? "#F0AD4E"
      : swapStatus === "failed"
      ? "red"
      : undefined;
  return (
    <Container style={{ background }}>
      <Typography>
        <span>{swapStatusText(swapStatus)}</span>
      </Typography>
    </Container>
  );
};

const Container = styled("div")({
  padding: "4px 10px",
  borderRadius: 16,
  span: {
    color: "white",
    fontSize: 12,
  },
});
