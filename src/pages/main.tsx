import _ from "lodash";
import styled from "styled-components";
import { Card, Sessions } from "../components";
import { useMemo } from "react";
import { useSwapsQuery } from "query";

export function MainPage() {
  return (
    <Container>
      <Content />
    </Container>
  );
}

const Content = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useSwapsQuery();

  const sessions = useMemo(() => {
    return data?.pages.flatMap((page) => page) || [];
  }, [data]);
  

  return (
    <Sessions
      isFetchingNextPage={isFetchingNextPage}
      sessions={sessions}
      isLoading={isLoading}
      loadMore={fetchNextPage}
    />
  );
};

const Container = styled(Card)`
  width: 100%;
  height: 500px;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
`;
