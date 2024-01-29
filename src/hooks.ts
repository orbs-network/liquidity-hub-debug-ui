import { useMemo } from "react";
import { StringParam, useQueryParams, NumberParam } from "use-query-params";
import { DEFAULT_SESSIONS_TIME_RANGE } from "./config";
import { getWeb3 } from "./helpers";

export const useAppParams = () => {
  const [query, setQuery] = useQueryParams(
    {
      timeRange: StringParam,
      sessionType: StringParam,
      chainId: NumberParam,
    },
    {
      updateType: "pushIn",
    }
  );

  return {
    query: {
      timeRange: query.timeRange || DEFAULT_SESSIONS_TIME_RANGE,
      sessionType: query.sessionType || "all",
      chainId: query.chainId,
    },
    setQuery,
  };
};

export const useWeb3 = (chainId?: number) => {
  return useMemo(() => getWeb3(chainId), [chainId]);
};
