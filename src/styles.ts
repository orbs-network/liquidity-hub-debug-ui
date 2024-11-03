import { Text } from "@chakra-ui/react";
import styled from "styled-components";
export const RowFlex = styled.div<{
  $gap?: number;
  $noGap?: boolean;
  $alignItems?: string;
  $justifyContent?: string;
}>`
  display: flex;
  flex-direction: row;
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  justify-content: ${({ $justifyContent }) => $justifyContent || "center"};
  gap: ${({ $gap, $noGap }) => $noGap ? 0 :  $gap || 10}px;
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


export const colors = {
  border: "#e9ecef",
};




export const Card = styled.div`
  box-shadow: 0 0.5rem 1.2rem rgb(189 197 209 / 20%);
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
`;

