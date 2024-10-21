import { Sessions } from "components";
import { useAppParams } from "hooks";
import { useGetClobSessionsQuery } from "query";
import { useMemo } from "react";
import { useParams } from "react-router";
import { SessionsFilter } from "types";

export function WalletTransactionsPage() {
  const params = useParams();
  const {
    query: { chainId, sessionType },
  } = useAppParams();
const timeRange = '300d'
  const filter = useMemo(() => {
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
    query.should?.push({ keyword: "user", value: params.address });
    query.should?.push({ keyword: "userAddress", value: params.address });

    return query;
  }, [params, chainId, sessionType, timeRange]);

  const { data: sessions, isLoading } = useGetClobSessionsQuery(
    filter,
    timeRange
  );

  return <Sessions sessions={sessions} isLoading={isLoading} />;
}
