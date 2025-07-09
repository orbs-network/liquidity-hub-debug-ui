import styled from "styled-components";
import { Copy , Check} from "react-feather";
import { Tooltip, Typography } from "antd";
import TextOverflow from "react-text-overflow";
import { useState } from "react";
import { useCopyToClipboard, useExplorerUrl } from "@/hooks";
import { colors } from "@/consts";
const { Link } = Typography;

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
      <Typography>
        <StyledLink href={url} target="_blank">
          <TextOverflow text={text || ""} />
        </StyledLink>
      </Typography>
    {success && <StyledCopySuccess><Check /></StyledCopySuccess>}
      {success ?  null  :address && (
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
      <Tooltip
        placement="right"
        title={!name ? undefined : `${name} (${symbol})`}
      >
        {" "}
        <Typography>{symbol}</Typography>
      </Tooltip>
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
    <AddressLink
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
position: relative;
top: 2px;
svg {
  width: 16px;
  height: 16px;
  color: ${colors.dark.link};
}
`


const StyledCopy = styled("button")`
  color: black;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  padding: 0;
  background: none;
  border: none;
  position: relative;
  top: 2px;
  svg {
    width: 16px;
    height: 16px;
    color: ${colors.dark.link};
  }
`;

const Container = styled.div`
  display: flex;
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

const StyledLink = styled(Link)`
  font-weight: 500;
  display: flex;
  font-size: 14px;
  text-decoration: none;
  * {
    color: ${colors.dark.link}!important;
  }
  &:hover {
    text-decoration: underline;
  }
`;
