import { FullHeightContainer } from "components";
import { PageLayout } from "components/PageLayout";
import { SearchSessionInput } from "components/SearchSessionInput";
import _ from "lodash";
import styled from "styled-components";
import { ColumnFlex } from "styles";

export const HomePage = () => {
  return (
    <Container>
      <PageLayout>
        <PageLayout.Logo />
        <Content>
          <StyledTitle>Search for transaction</StyledTitle>
          <StyledSearchSessionInput />
        </Content>
      </PageLayout>
    </Container>
  );
};

const Content = styled(ColumnFlex)({
  flex: 1,
  width: "100%",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: '20vh',
  gap: 40,
});

const StyledSearchSessionInput = styled(SearchSessionInput)`
  max-width: 600px;
  width: 100%;
  input {
    height: 50px;
  }
`;

const Container = styled(FullHeightContainer)`
  padding: 20px;
`;

const StyledTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;
