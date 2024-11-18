import { styled } from "styled-components";
import { Card, ColumnFlex, LightButton, RowFlex } from "styles";
import { Link, useLocation } from "react-router-dom";
import { Skeleton, Typography } from "antd";
import { ReactNode, useState } from "react";
import { SearchSessionInput } from "./SearchSessionInput";
import orbsLogo from "assets/orbs.svg";
import { useIsMobile } from "hooks";
import { colors, MOBILE } from "consts";
import { Filters } from "./Filters";
import { Search } from "react-feather";
import { Popover } from "antd";
import { ROUTES } from "config";

export function Loader({ className = "" }: { className?: string }) {
  return (
    <StyledLoader className={className}>
      <Skeleton style={{ width: "70%" }} />
    </StyledLoader>
  );
}

const StyledLoader = styled(ColumnFlex)({
  width: "100%",
  alignItems: "flex-start",
});

export const Navbar = ({ children }: { children: ReactNode }) => {
  return (
    <StyledNavbar>
      <StyledNavbarContent>{children}</StyledNavbarContent>
    </StyledNavbar>
  );
};

const StyledNavbar = styled("div")`
  position: sticky;
  top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 2;
  @media (max-width: ${MOBILE}px) {
    top: 10px;
  }
`;

const StyledNavbarContent = styled(Card)({
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
  padding: "6px 20px",
  backgroundColor: colors.dark.cardBg,
  maxWidth: 1200,
  gap: 20,
  [`@media (max-width: ${MOBILE}px)`]: {
    padding: "6px 10px",
    height: 50,
  },
});

const StyledSearchSessionInput = styled(SearchSessionInput)({
  maxWidth: 300,
  width: "100%",

  input: {
    fontSize: 14,
    "&::placeholder": {
      fontSize: 14,
    },
  },
});

const StyledLogo = styled(Link)({
  marginRight: "auto",
  display: "flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "unset",
  span: {
    fontSize: 17,
    fontWeight: 600,
    position: "relative",
    top: 2,
    color: colors.dark.textMain,
  },
  img: {
    width: "35px",
    height: "35px",
  },
  [`@media (max-width: ${MOBILE}px)`]: {
    gap: 0,
    img: {
      width: "25px",
      height: "25px",
    },
    span: {
      display: "none",
    },
  },
});

const LiquidityHubLogo = () => {
  return (
    <StyledLogo to="/">
      <img src={orbsLogo} alt="orbs Logo" />
      <Typography.Title>
        <span>Liquidity Hub Explorer</span>
      </Typography.Title>
    </StyledLogo>
  );
};

const TwapLogo = () => {
  const search = useLocation().search;
  
  return (
    <StyledLogo to={`${ROUTES.twap.root}${search}`}>
      <img src={orbsLogo} alt="orbs Logo" />
      <Typography.Title>
        <span>TWAP</span>
      </Typography.Title>
    </StyledLogo>
  );
};

export const LiquidityHubNavbar = ({
  hideFilters,
}: {
  hideFilters?: boolean;
}) => {
  return (
    <Navbar>
      <LiquidityHubLogo />
      <StyledRight>
        <SearchInput />
        {!hideFilters && (
          <>
            <Filters.Chain type="lh" />
            <Filters.Partner type="lh" />
          </>
        )}
      </StyledRight>
    </Navbar>
  );
};

const SearchInput = () => {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);


  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  if (!isMobile) {
    return <StyledSearchSessionInput />;
  }

  return (
    <Popover

      overlayInnerStyle={{
        borderRadius: 20,
        padding: 10,

      }}
      content={
        <StyledMobileSearchInput />
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <StyledMobileSearchButton>
        <Search />
      </StyledMobileSearchButton>
    </Popover>
  );
};

const StyledMobileSearchButton = styled(LightButton)({
  padding: 5,
  borderRadius:'50%',
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const StyledMobileSearchInput = styled(StyledSearchSessionInput)({
  width: "90vw",
  maxWidth: 400
});

export const TwapNavbar = ({
  hideChainSelect = false,
  hidePartnerSelect = false,
}: {
  hideChainSelect?: boolean;
  hidePartnerSelect?: boolean;
}) => {
  return (
    <Navbar>
      <TwapLogo />
      <StyledRight>
        {!hideChainSelect && <Filters.Chain type="twap" />}
        {!hidePartnerSelect && <Filters.Partner type="twap" />}
      </StyledRight>
    </Navbar>
  );
};

const StyledRight = styled(RowFlex)({
  flex: 1,
  justifyContent: "flex-end",
});

export function Page({
  className = "",
  children,
  navbar,
}: {
  className?: string;
  children: React.ReactNode;
  navbar?: React.ReactNode;
}) {
  return (
    <Container className={className}>
      {navbar}
      {navbar && <Placeholder />}
      {children}
    </Container>
  );
}

const Placeholder = styled.div`
  height: 100px;
  width: 100%;
  position: fixed;
  top: 0px;
  background-color: ${colors.dark.bgMain};
  z-index: 1;
  @media (max-width: ${MOBILE}px) {
    height: 70px;
  }
`;

export const Container = styled(ColumnFlex)`
  height: 100%;
  width: 100%;
  position: relative;
  padding: 20px;
  border-radius: 20px;
  @media (max-width: ${MOBILE}px) {
    padding: 10px;
  }
`;

export const StyledLayout = styled(Card)`
  width: 100%;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: 1350px;
`;

const Layout = ({
  children,
  className = "",
  isLoading,
}: {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <StyledLayout className={className}>
      {isLoading ? <Loader /> : children}
    </StyledLayout>
  );
};

Navbar.LiquidityHubLogo = LiquidityHubLogo;
Navbar.LiquidityHub = LiquidityHubNavbar;
Navbar.TwapLogo = TwapLogo;
Navbar.Twap = TwapNavbar;
Page.Navbar = Navbar;
Page.Layout = Layout;
Page.LiquidityHubLogo = LiquidityHubLogo;
