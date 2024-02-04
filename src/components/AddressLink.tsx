import { Link } from '@chakra-ui/react';
import  { useMemo } from 'react'
import { getExplorer, makeElipsisAddress } from '../helpers';
import styled from 'styled-components';
import TextOverflow from 'react-text-overflow';
export function AddressLink({
  address,
  chainId,
  text,
  path = "address",
  short = false,
}: {
  address?: string;
  chainId?: number;
  text?: string;
  path?: string;
  short?: boolean;
}) {
  const url = useMemo(() => {
    const explorer = getExplorer(chainId);
    return `${explorer}/${path}/${address}`;
  }, [chainId, path]);

  const _address = useMemo(() => {
    if (text) return text;
    if (!short) return address;
    return makeElipsisAddress(address);
  }, [address, short, text]);

  if(!_address) return <>-</>;

  return (
    <StyledLink href={url} target="_blank">
      <TextOverflow text={_address || ""} />
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  color: rgb(115, 66, 220) !important;
  font-weight: 500;
`;

