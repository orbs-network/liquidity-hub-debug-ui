import { styled } from "styled-components";
import { Card, ColumnFlex, RowFlex } from "styles";
import LogoImg from "assets/orbs.svg";
import { Link } from "react-router-dom";
import { Skeleton, Typography } from "antd";

import { SearchSessionInput } from "components/SearchSessionInput";
import { ChainSelect } from "./ChainSelect";

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

const Navbar = () => {
  return (
    <StyledNavbar>
      <StyledNavbarContent>
        <LiquidityHubLogo />
        <StyledRight>
          <StyledSearchSessionInput />
          <ChainSelect />
        </StyledRight>
      </StyledNavbarContent>
    </StyledNavbar>
  );
};

const StyledSearchSessionInput = styled(SearchSessionInput)({
  maxWidth: 400,
  width: "100%",
  ".search-input-button": {
    width: 25,
    height: 25,
  },
  input: {
    fontSize: 14,
  },
});

const StyledRight = styled(RowFlex)({
  flex: 1,
  justifyContent: "flex-end",
});

const StyledNavbar = styled("div")`
  position: sticky;
  top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 2;
`;

const StyledNavbarContent = styled(Card)({
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100%",
  padding: "6px 20px",
  backgroundColor: "white",
  maxWidth: 1200,
});

const LiquidityHubLogo = () => {
  return (
    <StyledLogo to="/">
      <img src={LogoImg} alt="orbs Logo" />
      <Typography.Title>
        <span>Liquidity Hub Explorer</span>
      </Typography.Title>
    </StyledLogo>
  );
};

const StyledLogo = styled(Link)({
  marginRight: "auto",
  display: "flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "unset",
  span: {
    fontSize: 20,
    fontWeight: 600,
    position: "relative",
    top: 2,
    color: "#947DE5",
  },
  img: {
    width: "40px",
    height: "40px",
  },
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
  background-color: #f8f9fb;
  z-index: 1;
`;

export const Container = styled(ColumnFlex)`
  height: 100%;
  width: 100%;
  position: relative;
  padding: 20px;
  border-radius: 20px;
`;

export const StyledLayout = styled(Card)`
  width: 100%;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
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

Page.Navbar = Navbar;
Page.Layout = Layout;
Page.Logo = LiquidityHubLogo;
