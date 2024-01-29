import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
import styled from "styled-components";
import { ListSession } from "./ListSession";
import { FilterMenu } from "./FilterMenu";
import { ChainSelect } from "./ChainSelect";
import { PageLoader } from "../../components";
import { useGetAllSessionsQuery } from "../../query";
import { RowFlex, ColumnFlex } from "../../styles";

export function MainPage() {
  return (
    <Container>
      <RowFlex>
        <FilterMenu />
        <ChainSelect />
      </RowFlex>
      <Content />
    </Container>
  );
}

const Content = () => {
  const { data: sessions, isLoading } = useGetAllSessionsQuery();
    console.log({ sessions });
    
  if (isLoading)    {
    return (
      <PageLoader />
    );
  }
  if (_.isEmpty(sessions)) {
    return <div>No sessions found</div>;
  }

  return <ListContainer />;
};

const ListContainer = () => {
  const { data: sessions } = useGetAllSessionsQuery();
      return (
        <StyledList>
          <AutoSizer>
            {({ height, width }: any) => (
              <List
                overscanCount={5}
                className="List"
                itemData={sessions}
                height={height || 0}
                itemCount={_.size(sessions)}
                itemSize={60}
                width={width || 0}
              >
                {ListSession}
              </List>
            )}
          </AutoSizer>
        </StyledList>
      );
};

const StyledList = styled.div`
    flex: 1;
    width: 100%;
`

const Container = styled(ColumnFlex)`
  width: 100%;
  height: 500px;
  gap: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
`;
