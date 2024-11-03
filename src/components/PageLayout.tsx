import { styled } from "styled-components";
import { Card, ColumnFlex, RowFlex } from "styles";
import LogoImg from "assets/orbs.svg";
import { Link } from "react-router-dom";

import { SearchSessionInput } from "components/SearchSessionInput";
import { ChainSelect } from "./ChainSelect";

const Navbar = () => {
  return (
    <StyledNavbar>
      <StyledNavbarContent>
        <Logo />
        <StyledRight>
          <SearchSessionInput />
          <ChainSelect />
        </StyledRight>
      </StyledNavbarContent>
    </StyledNavbar>
  );
};

const StyledRight = styled(RowFlex)({
  flex: 1,
  justifyContent: "flex-end",
});

const StyledNavbar = styled(RowFlex)`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  z-index: 1;
  padding: 0px 30px;
  background: #f8f9fb;
`;

const StyledNavbarContent = styled(Card)({
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
  display: "flex",
  alignItems: "center",
  height: "100%",
  padding: "20px 30px",
  marginTop: 10,
});

const Logo = () => {
  return (
    <StyledLogo to="/">
      <img src={LogoImg} alt="orbs Logo" />
    </StyledLogo>
  );
};

const StyledLogo = styled(Link)({
    marginRight: "auto",
  img: {
    width: "40px",
    height: "40px",
  },
});

export function PageLayout({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className={className}>
      <Layout>{children}</Layout>
    </Container>
  );
}

PageLayout.Logo = Logo;
PageLayout.Navbar = Navbar;

export const Container = styled(ColumnFlex)`
  height: 100%;
  width: 100%;
`;

export const Layout = styled(Card)`
  width: 100%;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
`;
