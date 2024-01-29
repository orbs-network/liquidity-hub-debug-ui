import axios from "axios";
import _ from "lodash";
import {
  getIdsFromSessions,
  parseSessions,
  normalizeSessions,
} from "../helpers";
import { SessionsFilter, SessionType } from "../types";
import { createQueryBody } from "./elastic";

const SERVER_SESSIONS = "orbs-clob-poc10.*";
const CLIENT_SESSIONS = "orbs-liquidity-hub-ui*";

interface FetchSessionArgs {
  url: string;
  filter?: SessionsFilter;
  timeRange?: string;
  signal?: AbortSignal;
}

const fetchSessions = async ({
  url,
  filter,
  timeRange,
  signal,
}: FetchSessionArgs) => {
  const data = createQueryBody({
    filter: filter && _.size(filter) ? filter : undefined,
    timeRange,
  });

  const response = await axios.post(
    `http://3.141.233.132:9200/${url}/_search`,
    { ...data },
    { signal: signal }
  );

  return normalizeSessions(
    response.data.hits?.hits.map((hit: any) => hit.fields)
  );
};
const fetchServerSessions = async (args: Partial<FetchSessionArgs>) => {
  return fetchSessions({ url: SERVER_SESSIONS, ...args });
};
const fetchClientSessions = async (args: Partial<FetchSessionArgs>) => {
  const sessions = await fetchSessions({ url: CLIENT_SESSIONS, ...args });
  return sessions.map((session) => {
    return {
      ...session,
      type: "client",
    };
  });
};

export const getSessionById = async (
  sessionId: string,
  signal?: AbortSignal
) => {
  const server = fetchServerSessions({
    filter: [{ keyword: "sessionId", value: sessionId }],
    timeRange: "30d",
    signal,
  });

  const client = fetchClientSessions({
    filter: [{ keyword: "sessionId", value: sessionId }],
    timeRange: "30d",
    signal,
  });

  const [serverRes, clientRes] = await Promise.all([server, client]);

  return _.first(parseSessions(_.flatten([clientRes, serverRes]))) || null;
};

export const getAllSessions = async ({
  type,
  signal,
  timeRange,
  chainId,
}: {
  type?: SessionType;
  signal?: AbortSignal;
  timeRange?: string;
  chainId?: number;
}) => {
  let filter = [];
  if (chainId) {
    filter.push({ keyword: "chainId", value: chainId.toString() });
  }

  type = type === "all" ? undefined : type;

  let args: Partial<FetchSessionArgs> = {
    signal,
    timeRange,
    filter,
  };


  if (!type) {
    const serverSessions = fetchServerSessions(args);
    const clientSessions = fetchClientSessions(args);
    const [serverRes, clientRes] = await Promise.all([
      serverSessions,
      clientSessions,
    ]);
    return parseSessions(_.flatten([clientRes, serverRes]));
  }

  if (type === "swap") {
    filter.push({ keyword: "type", value: "swap" });
  } else {
    filter.push({ keyword: "swapStatus", value: type! });
  }

  const swapSessions = await fetchServerSessions({ ...args, filter });

  const ids = getIdsFromSessions(swapSessions);

  const quoteSessions = fetchServerSessions({
    ...args,
    filter: [
      {
        keyword: "sessionId",
        value: ids,
      },
      {
        keyword: "type",
        value: "quote",
      },
    ],
  });

  const clientSessions = fetchClientSessions({
    ...args,
    filter: [
      {
        keyword: "sessionId",
        value: ids,
      },
    ],
  });

  const [quoteRes, clientRes] = await Promise.all([
    quoteSessions,
    clientSessions,
  ]);

  return parseSessions(_.flatten([clientRes, swapSessions, quoteRes]));
};
export const api = {
  getAllSessions,
  getSessionById,
};
