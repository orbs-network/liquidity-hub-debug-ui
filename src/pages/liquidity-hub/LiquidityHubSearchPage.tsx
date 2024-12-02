import _ from "lodash";
import styled from "styled-components";
import { ColumnFlex } from "styles";
import { Typography } from "antd";
import { MOBILE } from "consts";
import { Page } from "components";
import { LiquidityHubSearchInput } from "./components/LiquidityHubSearchInput";

export const SearchPage = () => {
  return (
    <Page.Layout>
      <Content>
        <StyledTitle>Search for transaction or user</StyledTitle>
        <StyledSearchSessionInput />
      </Content>
    </Page.Layout>
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

const StyledSearchSessionInput = styled(LiquidityHubSearchInput)`
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
