import React from 'react'
import styled from 'styled-components'
import { colors } from '../styles';
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <StyledCard className={className}>{children}</StyledCard>;
}


export const StyledCard = styled.div`
  box-shadow: 0 0.5rem 1.2rem rgb(189 197 209 / 20%);
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${colors.border};
  background-color: white;
`;
