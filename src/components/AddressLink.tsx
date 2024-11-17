import styled from "styled-components";
import { useCopyToClipboard, useExplorerUrl } from "hooks";
import { Copy } from "react-feather";
import { notification, Tooltip, Typography } from "antd";
import { colors } from "consts";
import TextOverflow from "react-text-overflow";
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
  const [api, contextHolder] = notification.useNotification();

  const copy = useCopyToClipboard();
  const onCopy = (e: any) => {
    api.success({
      showProgress: true,
      message: "Copied to clipboard",
      placement: "bottomRight",
      duration: 3,
    });
    e.preventDefault();
    copy(address!);
  };

  return (
    <Container>
      {contextHolder}
      <Typography>
        <StyledLink href={url} target="_blank">
          <TextOverflow text={text || ""} />
        </StyledLink>
      </Typography>

      {address && (
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
  name
}: {
  chainId?: number;
  address?: string;
  symbol?: string;
  name?: string;
}) => {
  const explorer = useExplorerUrl(chainId);
  return (
    <StyledTokenAddress href={`${explorer}/address/${address}`} target="_blank">
     <Tooltip placement="right" title={!name ? undefined : `${name} (${symbol})`}> <Typography>{symbol}</Typography></Tooltip>
    </StyledTokenAddress>
  );
};

const StyledTokenAddress = styled('a')({
  textDecoration: "none",
  color: colors.dark.textMain,
  "&:hover": {
    textDecoration: "underline",
  },
})

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
