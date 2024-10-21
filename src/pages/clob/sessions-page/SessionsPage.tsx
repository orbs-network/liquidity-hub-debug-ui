import _ from "lodash";
import styled from "styled-components";
import { FilterMenu } from "./FilterMenu";
import { ChainSelect } from "./ChainSelect";
import { Card, Sessions } from "../../../components";
import { RowFlex, ColumnFlex } from "../../../styles";
import { SessionsFilter } from "../../../types";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppParams } from "../../../hooks";
import { useGetClobSessionsQuery } from "query";
import { identifyAddressOrTxHash } from "utils";

export function ClobSessionsPage() {
  return (
    <Container>
      <RowFlex>
        <FilterMenu />
        <ChainSelect />
      </RowFlex>
      <StyledContent>
        <Content  />
      </StyledContent>
    </Container>
  );
}

const StyledContent = styled(Card)`
  flex: 1;
`;

const Content = () => {
  const params = useParams();
  const {
    query: { chainId, sessionType, timeRange },
  } = useAppParams();

  const filter = useMemo((): SessionsFilter | undefined => {
    let query: SessionsFilter = {
      should: [],
      must: [],
    };

    if (sessionType === "swap") {
      query.must?.push({ keyword: "type", value: "swap" });
    } else if (sessionType) {
      query.must?.push({ keyword: "swapStatus", value: sessionType });
    }

    if (chainId) {
      query.must?.push({ keyword: "chainId", value: chainId });
    }
    if (!params.address) {
      return query;
    }
    if (identifyAddressOrTxHash(params.address) === "address") {
      query.should?.push({ keyword: "user", value: params.address });
      query.should?.push({ keyword: "userAddress", value: params.address });
    }

    if (identifyAddressOrTxHash(params.address) === "txHash") {
      query.should?.push({ keyword: "txHash", value: params.address });
    }
    return query;
  }, [params, chainId, sessionType, timeRange]);

  const { data: sessions, isLoading } = useGetClobSessionsQuery(
    filter,
    timeRange
  );

  return <Sessions sessions={sessions} isLoading={isLoading} />;
};

const Container = styled(ColumnFlex)`
  width: 100%;
  height: 500px;
  gap: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
`;
