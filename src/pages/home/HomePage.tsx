import { FullHeightContainer } from "components";
import { Page } from "components/Page";
import { SearchSessionInput } from "components/SearchSessionInput";
import _ from "lodash";
import styled from "styled-components";
import { ColumnFlex } from "styles";
import { Typography } from "antd";
import { MOBILE } from "consts";

export const HomePage = () => {
  return (
    <FullHeightContainer>
      <Page>
        <Page.Layout>
          <Page.Navbar.LiquidityHubLogo />
          <Content>
            <StyledTitle>Search for transaction</StyledTitle>
            <StyledSearchSessionInput />
          </Content>
        </Page.Layout>
      </Page>
    </FullHeightContainer>
  );
};



const Content = styled(ColumnFlex)({
  flex: 1,
  width: "100%",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "20vh",
  gap: 20,
});

const StyledSearchSessionInput = styled(SearchSessionInput)`
  max-width: 800px;
  width: 100%;
  input {
    height: 50px;
    font-size: 16px;
  }
`;


const StyledTitle = styled(Typography)`
font-size: 24px;
font-weight: 600;
  @media (max-width: ${MOBILE}px) {
    font-size: 20px;
  }
`;
