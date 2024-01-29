import { Text } from "@chakra-ui/react";
import styled from "styled-components";
export const RowFlex = styled.div<{
  $gap?: number;
  $alignItems?: string;
  $justifyContent?: string;
}>`
  display: flex;
  flex-direction: row;
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "center"};
  gap: ${({ $gap }) => $gap || 10}px;
`;

export const ColumnFlex = styled.div<{
  $gap?: number;
  $alignItems?: string;
  $justifyContent?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "center"};
  gap: ${({ $gap }) => $gap || 10}px;
`;

export const OverflowText = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex:1;
`;
