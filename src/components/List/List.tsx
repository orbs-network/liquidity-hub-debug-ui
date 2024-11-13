import styled from "styled-components";
import _ from "lodash";
import { ReactNode, useCallback } from "react";
import { Virtuoso } from "react-virtuoso";
import { Typography, Spin, Skeleton, Avatar } from "antd";
import { useChainConfig, useIsMobile, useNumberFormatter } from "hooks";
import { ColumnFlex, RowFlex } from "styles";
import TextOverflow from "react-text-overflow";
import { DesktopRowComponent, MobileRowComponent } from "./types";
import { ChevronRight } from "react-feather";
import moment from "moment";

type HeaderLabel = {
  label: string;
  width: number;
  alignCenter?: boolean;
};

function List<T>({
  items = [],
  loadMore,
  isLoading,
  DesktopComponent,
  isFetchingNextPage,
  MobileComponent,
  headerLabels,
}: {
  items?: T[];
  loadMore: () => void;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  DesktopComponent: DesktopRowComponent<T>;
  MobileComponent: MobileRowComponent<T>;
  headerLabels: HeaderLabel[];
}) {
  const isMobile = useIsMobile();

  const endReached = useCallback(async () => {
    if (isFetchingNextPage) return;
    loadMore();
  }, [loadMore, isFetchingNextPage]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (_.isEmpty(items)) {
    return <StyledEmpty>Nothing found</StyledEmpty>;
  }

  return (
    <StyledList>
      <ListHeader isMobile={isMobile} labels={headerLabels} />
      <Virtuoso
        endReached={endReached}
        useWindowScroll
        totalCount={isFetchingNextPage ? _.size(items) + 1 : _.size(items)}
        overscan={10}
        itemContent={(index) => {
          const item = items[index];
          return (
            <Item
              isMobile={isMobile}
              item={item}
              DesktopComponent={DesktopComponent}
              MobileComponent={MobileComponent}
            />
          );
        }}
      />
    </StyledList>
  );
}

const ListHeader = ({
  labels,
  isMobile,
}: {
  labels: HeaderLabel[];
  isMobile: boolean;
}) => {
  if (isMobile) return null;
  return (
    <StyledHeader>
      {_.map(labels, (item, index) => {
        return (
          <StyledHeaderItem
            key={index}
            style={{
              width: `${item.width}%`,
              justifyContent: item.alignCenter ? "center" : "flex-start",
              textAlign: item.alignCenter ? "center" : "left",
            }}
          >
            {item.label}
          </StyledHeaderItem>
        );
      })}
    </StyledHeader>
  );
};

function Item<T>({
  item,
  DesktopComponent,
  MobileComponent,
  isMobile,
}: {
  item: T;
  DesktopComponent: DesktopRowComponent<T>;
  MobileComponent: MobileRowComponent<T>;
  isMobile: boolean;
}) {
  if (!item) {
    return (
      <StyledLoaderContainer>
        <Spin />
      </StyledLoaderContainer>
    );
  }
  if (isMobile) {
    return (
      <StyledMobileContainer>
        <MobileComponent item={item} />
      </StyledMobileContainer>
    );
  }

  return <DesktopComponent item={item} />;
}

const MobileRow = ({
  chainId,
  partner = "",
  inToken = "",
  outToken = "",
  usd = "",
  timestamp,
  status,
  statusColor,
}: {
  chainId?: number;
  partner?: string;
  inToken?: string;
  outToken?: string;
  usd?: string | number;
  timestamp?: number;
  status?: string;
  statusColor?: string;
}) => {
  const chainIdConfig = useChainConfig(chainId);
  const usdF = useNumberFormatter({ value: usd, format: true });
  return (
    <StyledMobileRow>
      <MobileStatus style={{ background: statusColor }}>
        <Typography>{status}</Typography>
      </MobileStatus>
      <StyledMobileContainerRight>
        <ColumnFlex style={{ alignItems: "flex-start", gap: 2 }}>
          <RowFlex $gap={5}>
            <Typography style={{ fontSize: 14 }}>
              <TextOverflow text={partner} />
            </Typography>
            <Avatar src={chainIdConfig?.logoUrl} size={20} />
          </RowFlex>
          <StyledMobileContainerTokens>
            <Typography>{inToken}</Typography>
            <ChevronRight />
            <Typography> {outToken}</Typography>
            {usd && (
              <Typography>
                <small>{`($${usdF})`}</small>
              </Typography>
            )}
          </StyledMobileContainerTokens>
          <Typography style={{ fontSize: 13 }}>
            <small>{moment(timestamp).format("D MMM HH:mm")}</small>
          </Typography>
        </ColumnFlex>
      </StyledMobileContainerRight>
    </StyledMobileRow>
  );
};

const StyledMobileRow = styled(RowFlex)({
  alignItems: "flex-start",
  position: "relative",
  gap: 10,
  width: "100%",
});
const MobileStatus = styled("div")({
  position: "absolute",
  top: 0,
  right: 0,
  padding: "2px 8px",
  borderRadius: 20,
  ".ant-typography": {
    color: "white",
    fontSize: 11
  },
});

const StyledMobileContainer = styled('div')({
  borderBottom: "1px solid #f0f0f0",
  width: "100%",
});

const StyledMobileContainerRight = styled("div")({
  flex: 1,
});
const StyledMobileContainerTokens = styled(RowFlex)({
    gap: 2,
  justifyContent: "flex-start",
  alignItems: "center",
  small: {
    opacity: 0.7,
    marginLeft: 3,
  },
  ".ant-typography": {
    fontSize: 12,
  },
  svg: {
    width: 14,
    height: 14,
    position: "relative",
    top:-2
  },
});

const DesktopRowElement = ({
  children,
  className = "",
  width,
  alignCenter,
}: {
  children: ReactNode;
  className?: string;
  width: number;
  alignCenter?: boolean;
}) => {
  return (
    <StyledRowElement
      style={{
        width: `${width}%`,
        justifyContent: alignCenter ? "center" : "flex-start",
      }}
      className={className}
    >
      {children}
    </StyledRowElement>
  );
};

const DesktopRowElementText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <StyledText className={className}>
      <TextOverflow text={text} />
    </StyledText>
  );
};

function DesktopRow({ children }: { children: ReactNode }) {
  return <ListSessionContainer>{children}</ListSessionContainer>;
}

DesktopRowElement.Text = DesktopRowElementText;
DesktopRow.Element = DesktopRowElement;
List.DesktopRow = DesktopRow;
List.MobileRow = MobileRow;

export { List };

const StyledRowElement = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  textAlign: "left",
  paddingRight: 20,
  "&:last-child": {
    paddingRight: 10,
  },
});

const ListSessionContainer = styled(RowFlex)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 15px;
  gap: 0px;
  position: relative;
  border-bottom: 1px solid #f1f3fe;
`;

const StyledHeader = styled(RowFlex)`
  justify-content: flex-start;
  padding: 0px 15px;
  height: 50px;
  gap: 0px;
  font-weight: 500;
  background: #f1f3fe;
  border-radius: 6px;
`;

const StyledHeaderItem = styled(Typography)({
  fontSize: 14,
  textAlign: "left",
  paddingRight: 20,
  fontWeight: 600,
  "&:last-child": {
    textAlign: "center",
    paddingRight: 0,
  },
});

const StyledList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledText = styled("div")({
  fontSize: 14,
});

const StyledEmpty = styled.div`
  padding: 20px;
`;

const StyledLoaderContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
  height: 100px;
`;
