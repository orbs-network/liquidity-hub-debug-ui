import { Link } from '@chakra-ui/react';
import  { useMemo } from 'react'
import { getExplorer, makeElipsisAddress } from '../helpers';
import styled from 'styled-components';
export function AddressLink({ address, chainId, text }: { address: string; chainId?: number, text?: string }) {

  const url = useMemo(
    () => {
      const explorer = getExplorer(chainId);
      return `${explorer}/address/${address}`;
    },
    [chainId]
  );

  return (
    <StyledLink href={url} target="_blank">
      {text || makeElipsisAddress(address)}
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  color: rgb(115, 66, 220) !important;
  font-weight: 500;
`;

