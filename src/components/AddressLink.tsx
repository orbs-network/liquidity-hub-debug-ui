import { Link } from '@chakra-ui/react';
import  { useMemo } from 'react'
import { makeElipsisAddress } from '../helpers';
import styled from 'styled-components';
import TextOverflow from 'react-text-overflow';
import {CopyIcon} from '@chakra-ui/icons'
import { useChainConfig, useCopyToClipboard } from 'hooks';
export function AddressLink({
  address,
  chainId,
  text,
  path = "tx",
  short = false,
  hideCopy = true,
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

  const explorerUrl = useChainConfig(chainId)?.explorer;


  const url = `${explorerUrl}/${path}/${address}`;



  const _address = useMemo(() => {
    if (text) return text;
    if (!short) return address;
    return makeElipsisAddress(address);
  }, [address, short, text]);

  if (!_address || !address) return <>-</>;

  return (
    <Container>
      <StyledLink href={url} target='_blank'>
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

