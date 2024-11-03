import _ from "lodash";
import styled from "styled-components";
import { useMemo } from "react";
import { useSwapsQuery } from "query";
import { Sessions } from "components";
import { useParams } from "react-router-dom";
import { PageLayout } from "components/PageLayout";

export function UserTransactionsPage() {
  return (
    <Container>
      <Content />
    </Container>
  );
}

const Content = () => {
  const { address } = useParams();

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useSwapsQuery(address);

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

const Container = styled(PageLayout)`

`;
