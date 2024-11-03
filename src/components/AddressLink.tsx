import { useMemo } from "react";
import { makeElipsisAddress } from "../helpers";
import styled from "styled-components";
import TextOverflow from "react-text-overflow";
import { useChainConfig, useCopyToClipboard } from "hooks";
import { Copy } from "react-feather";
import { Typography } from "antd";

export function AddressLink({
  address,
  chainId,
  text,
  path = "tx",
  short = false,
  hideCopy = true,
  underline = false,
}: {
  address?: string;
  chainId?: number;
  text?: string;
  path?: string;
  short?: boolean;
  hideCopy?: boolean;
  underline?: boolean;
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
      <Typography>
        <StyledLink href={url} target="_blank" $underline={underline}>
          <TextOverflow text={_address || ""} />
        </StyledLink>
      </Typography>
      {!hideCopy && <StyledIcon onClick={onCopy} />}
    </Container>
  );
}

const StyledIcon = styled(Copy)`
  color: rgb(115, 66, 220) !important;
  cursor: pointer;
`;

const Container = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StyledLink = styled("a")<{ $underline: boolean }>`
  font-weight: 500;
  display: flex;
  font-size: 14px;
  text-decoration: ${({ $underline }) => ($underline ? "underline" : "none")};
  color: black!important;
  &:hover {
    text-decoration: underline;
  }
`;
