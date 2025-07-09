import { Page } from "@/components/Page";
import styled from "styled-components";
import { RowFlex } from "@/styles";
import { Typography } from "antd";
import { useNavigateWithParams } from "@/hooks";
import { ROUTES } from "@/config";

const Navbar = () => {

  
  return (
    <Page.Navbar>
      <Page.Navbar.Logo text="ORBS Explorer" />
    </Page.Navbar>
  );
};

export const MainPage = () => {

  return (
    <Page navbar={<Navbar />}>
      <Page.Layout>
        <Content>
          <Product label="Liquidity Hub" path={ROUTES.liquidityHub.root} />
          <Product label="Twap" path={ROUTES.twap.root} />
        </Content>
      </Page.Layout>
    </Page>
  );
};

const Content = styled(RowFlex)({
  flex: 1,
  width: "100%",
  alignItems: "center",
  gap: 20,
});

const Product = ({ label, path }: { label: string; path: string }) => {
  const navigate = useNavigateWithParams();

  return (
    <StyledProduct onClick={() => navigate(path)}>
      <StyledProductTitle>{label}</StyledProductTitle>
    </StyledProduct>
  );
};
const StyledProductTitle = styled(Typography)({
  fontSize: 16,
  fontWeight: 600,
});
const StyledProduct = styled("div")({
  background: "#1B1D25",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  borderRadius: 20,
  width: 200,
  alignItems: "center",
  padding: 20,
  cursor: "pointer",
});
