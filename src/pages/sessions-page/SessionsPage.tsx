import _ from "lodash";
import styled from "styled-components";
import { FilterMenu } from "./FilterMenu";
import { ChainSelect } from "./ChainSelect";
import { Card, Sessions } from "../../components";
import { usegetSessionsQuery } from "../../query";
import { RowFlex, ColumnFlex } from "../../styles";
import { SessionsFilter, SessionsSearchBy } from "../../types";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppParams } from "../../hooks";
import { DEFAULT_SESSIONS_TIME_RANGE } from "../../config";

export function SessionsPage({ searchBy }: { searchBy: SessionsSearchBy }) {
  return (
    <Container>
      <RowFlex>
        <FilterMenu />
        <ChainSelect />
      </RowFlex>
      <StyledContent>
        <Content searchBy={searchBy} />
      </StyledContent>
    </Container>
  );
}

const StyledContent = styled(Card)`
  flex: 1;
`;

const Content = ({ searchBy }: { searchBy: SessionsSearchBy }) => {
  const params = useParams();
  const { query } = useAppParams();
    const timeRange =
      query.timeRange === "all" ? undefined : DEFAULT_SESSIONS_TIME_RANGE;

  const filter = useMemo((): SessionsFilter | undefined => {
    const sessionType = query.sessionType;

    let result: SessionsFilter = {
      should: [],
      must: [],
    };

    if (sessionType === "swap") {
      result.must?.push({ keyword: "type", value: "swap" });
    } else if (sessionType) {
      result.must?.push({ keyword: "swapStatus", value: sessionType });
    }

    if (query.chainId) {
      result.must?.push({ keyword: "chainId", value: query.chainId });
    }
    if (searchBy === "address" && params.address) {
      result.should?.push({ keyword: "user", value: params.address });
      result.should?.push({ keyword: "userAddress", value: params.address });
    }
    return result;
  }, [searchBy, params, query]);

  const { data: sessions, isLoading } = usegetSessionsQuery(
    filter,
    timeRange
  );

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
