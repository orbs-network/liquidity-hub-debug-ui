import { styled } from "styled-components";
import { Card, ColumnFlex, LightButton } from "styles";
import { Link } from "react-router-dom";
import { Skeleton, Typography } from "antd";
import { ReactNode, useState } from "react";
import orbsLogo from "assets/orbs.svg";
import { useHeight, useIsMobile } from "hooks";
import { colors, MAX_LAYOUT_WIDTH, MOBILE } from "consts";
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
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  backgroundColor: colors.dark.cardBg,
  maxWidth: MAX_LAYOUT_WIDTH,
  gap: 20,
  [`@media (max-width: ${MOBILE}px)`]: {
    padding: "6px 10px",
    height: 50,
  },
});

const StyledSearchSessionInput = styled("div")({
  maxWidth: 320,
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

const Logo = ({ text, path = ROUTES.root }: { text: string, path?: string }) => {
  return (
    <StyledLogo to={path}>
      <img src={orbsLogo} alt="orbs Logo" />
      <Typography.Title>
        <span>{text}</span>
      </Typography.Title>
    </StyledLogo>
  );
};



const NavbarSearchInput = ({ Input }: { Input: ReactNode }) => {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  if (!isMobile) {
    return <StyledSearchSessionInput>{Input}</StyledSearchSessionInput>;
  }

  return (
    <Popover
      overlayInnerStyle={{
        borderRadius: 20,
        padding: 10,
      }}
      content={<StyledMobileSearchInput>{Input}</StyledMobileSearchInput>}
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

const StyledMobileSearchInput = styled("div")({
  width: "90vw",
  maxWidth: 400,
});

const StyledMobileSearchButton = styled(LightButton)({
  padding: 5,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
  const height = useHeight();

  return (
    <Container className={className} style={{ minHeight: height }}>
      {navbar}
      {navbar && <Placeholder />}
      {children}
    </Container>
  );
}

const Placeholder = styled.div`
  height: 90px;
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
  gap: 0px;
  @media (max-width: ${MOBILE}px) {
    padding: 10px;
  }
`;

export const StyledLayout = styled(Card)`
  width: 100%;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: ${MAX_LAYOUT_WIDTH}px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
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

Navbar.Logo = Logo;
Navbar.InputContainer = NavbarSearchInput;

Page.Navbar = Navbar;
Page.Layout = Layout;
