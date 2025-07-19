import { colors } from "@/consts";
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

export const OverflowText = styled('p')`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex:1;
`;



export const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
`;



export const LightButton = styled(RowFlex)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  gap: 8,
  backgroundColor: "#353547",
  borderRadius: 20,
  paddingRight: 10,
  transition: "all 0.3s",
  svg: {
    color: colors.dark.textMain,
  },
  "&:hover": {
    opacity: 0.8,
  },
  article: {
    fontWeight: 600,
    opacity: 0.87
  }

});


export const StyledInput = styled("input")`
  height: 35px;
  width: 100%;
  text-indent: 10px;
  border: none;
  outline: none;
  background-color: transparent;
  color: ${colors.dark.textMain};
  font-family: "IBM Plex Mono", monospace;
  padding-right: 40px;
  &::placeholder {
    transition: opacity 0.2s;
  }
  &:focus::placeholder {
    opacity: 0; /* Hides the placeholder */
  }
`;