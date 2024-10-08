import { Link } from '@chakra-ui/react';
import  { useMemo } from 'react'
import { makeElipsisAddress } from '../helpers';
import styled from 'styled-components';
import TextOverflow from 'react-text-overflow';
import {CopyIcon} from '@chakra-ui/icons'
import { useCopyToClipboard } from 'hooks';
export function AddressLink({
  address,
  chainId,
  text,
  path = "address",
  short = false,
  hideCopy = false,
}: {
  address?: string;
  chainId?: number;
  text?: string;
  path?: string;
  short?: boolean;
  hideCopy?: boolean;
}) {
  const copy = useCopyToClipboard();
  const onCopy = (e: any) => {
    e.preventDefault();
    copy(address!);
  };
  // const url = useMemo(() => {
  //   const explorer = getExplorer(chainId);
  //   return `${explorer}/${path}/${address}`;
  // }, [chainId, path]);

  const url = useMemo(() => {
    return `/public/${address}`;
  }, [chainId, path]);

  const _address = useMemo(() => {
    if (text) return text;
    if (!short) return address;
    return makeElipsisAddress(address);
  }, [address, short, text]);

  if (!_address || !address) return <>-</>;

  return (
    <Container>
      <StyledLink href={url}>
        <TextOverflow text={_address || ""} />
      </StyledLink>
     {!hideCopy &&  <StyledIcon onClick={onCopy} />}
    </Container>
  );
}

const StyledIcon = styled(CopyIcon)`
  color: rgb(115, 66, 220) !important;
  cursor: pointer;
`;

const Container = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StyledLink = styled(Link)`
  color: rgb(115, 66, 220) !important;
  font-weight: 500;
  display: flex;
`;

