import styled from "styled-components";
import { Copy, Check } from "react-feather";
import { Tooltip } from "antd";
import { useState } from "react";
import { useCopyToClipboard, useExplorerUrl } from "@/hooks";
import { colors } from "@/consts";
import { shortenAddress } from "@/utils";
import { Address } from "./Address";

export function AddressLink({
  address,
  url,
  text,
}: {
  address?: string;
  url: string;
  text?: string;
}) {
  const [success, setSuccess] = useState(false);

  const copy = useCopyToClipboard();
  const onCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (success) return;
    e.preventDefault();
    copy(address!);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1_500);
  };

  return (
    <Container>
      <a href={url} target="_blank" className="text-sm  hover:underline">
       {shortenAddress(text || "", 6)}
      </a>
      {success && (
        <StyledCopySuccess>
          <Check />
        </StyledCopySuccess>
      )}
      {success
        ? null
        : address && (
            <StyledCopy onClick={onCopy} className="copy-btn">
              <Copy />
            </StyledCopy>
          )}
    </Container>
  );
}

export const TokenAddress = ({
  chainId,
  address,
  symbol,
  name,
}: {
  chainId?: number;
  address?: string;
  symbol?: string;
  name?: string;
}) => {
  const explorer = useExplorerUrl(chainId);
  return (
    <StyledTokenAddress href={`${explorer}/address/${address}`} target="_blank">
      <p>{symbol}</p>
    </StyledTokenAddress>
  );
};

const StyledTokenAddress = styled("a")({
  textDecoration: "none",
  color: colors.dark.textMain,
  "&:hover": {
    textDecoration: "underline",
  },
});

export const WalletAddress = ({
  address,
  chainId,
}: {
  address?: string;
  chainId?: number;
}) => {
  const explorer = useExplorerUrl(chainId);
  return (
    <Address
      address={address}
      url={`${explorer}/address/${address}`}
      text={address}
    />
  );
};

export const TxHashAddress = ({
  address,
  chainId,
}: {
  address?: string;
  chainId?: number;
}) => {
  const explorer = useExplorerUrl(chainId);
  return (
    <AddressLink
      address={address}
      url={`${explorer}/tx/${address}`}
      text={address}
    />
  );
};

const StyledCopySuccess = styled("span")`
  position: absolute;
  top: 2px;
  left: 0px;

  svg {
    width: 16px;
    height: 16px;
    color: ${colors.dark.link};
  }
`;

const StyledCopy = styled("button")`
  color: black;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  padding: 0;
  background: none;
  border: none;
  position: absolute;
  top: 2px;
  left: 0px;
  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

const Container = styled.div`
  display: flex;
  padding-left: 20px;
  position: relative;
  align-items: center;
  gap: 5px;
  &:hover {
    ${StyledCopy} {
      opacity: 1;
      pointer-events: all;
    }
  }
`;
