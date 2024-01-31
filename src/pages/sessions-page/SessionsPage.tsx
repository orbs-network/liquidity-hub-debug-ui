import _ from "lodash";
import styled from "styled-components";
import { FilterMenu } from "./FilterMenu";
import { ChainSelect } from "./ChainSelect";
import { Card, Sessions } from "../../components";
import { useGetAllSessionsQuery } from "../../query";
import { RowFlex, ColumnFlex } from "../../styles";
import { SessionsSearchBy } from "../../types";

export function SessionsPage({ searchBy }: { searchBy: SessionsSearchBy }) {
  return (
    <Container>
      <RowFlex>
        <FilterMenu />
        <ChainSelect />
      </RowFlex>
      <StyledContent>
        <Content />
      </StyledContent>
    </Container>
  );
}

const StyledContent = styled(Card)`
  flex: 1;
`;

const Content = () => {
  const { data: sessions, isLoading } = useGetAllSessionsQuery();
  return <Sessions sessions={sessions} isLoading={isLoading} />;
};

const Container = styled(ColumnFlex)`
  width: 100%;
  height: 500px;
  gap: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
`;
