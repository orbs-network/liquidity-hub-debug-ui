import axios from "axios";
import _ from "lodash";
import { normalizeSessions } from "helpers";
import { parseFullSessionLogs, parseSwapLogs } from "./helpers";
import { ELASTIC_ENDPOINT } from "config";
import { queries } from "./elastic";
import { isValidSessionId, isValidTxHash } from "utils";
import { LHSession } from "types";

const SERVER_URL = `${ELASTIC_ENDPOINT}/orbs-clob-poc10.*`;
const CLIENT_URL = `${ELASTIC_ENDPOINT}/orbs-liquidity-hub-ui*`;

const getClientLogs = async (
  ids: string[],
  page: number,
  signal?: AbortSignal
) => {
  const data = queries.clientTrasactions(ids, page, 100);

  return fetchElastic(CLIENT_URL, data, signal);
};

const fetchSwaps = async ({
  page = 0,
  chainId,
  signal,
  walletAddress,
  dex,
}: {
  page: number;
  chainId?: number;
  signal?: AbortSignal;
  walletAddress?: string;
  dex?: string;
}) => {
  const data = queries.swaps({
    page,
    chainId,
    limit: 100,
    walletAddress,
    dex: dex?.toLowerCase(),
  });

  const logs = await fetchElastic(SERVER_URL, data, signal);
  const result = parseSwapLogs(logs);

  return result;
};

const getSession = async (
  txHashOrSessionId: string,
  signal?: AbortSignal
): Promise<LHSession> => {
  let query;

  if (isValidTxHash(txHashOrSessionId)) {
    query = queries.transactionHash(txHashOrSessionId);
  } else if (isValidSessionId(txHashOrSessionId)) {
    query = queries.sessionId(txHashOrSessionId);
  } else {
    throw new Error("Invalid transaction hash or session id");
  }

  const swapLogs = await fetchElastic(SERVER_URL, query, signal);
  const [swapLog] = swapLogs;

  const quoteQuery = queries.quote(swapLog.sessionId);
  const clientQuery = queries.client(swapLog.sessionId);
  
  const [quoteLogs, clientLogs] = [
    await fetchElastic(SERVER_URL, quoteQuery, signal),
    await fetchElastic(CLIENT_URL, clientQuery, signal),
  ];
    return parseFullSessionLogs(swapLog, quoteLogs, clientLogs);
};

const fetchElastic = async (url: string, data: any, signal?: AbortSignal) => {
  const response = await axios.post(`${url}/_search`, { ...data }, { signal });

  return normalizeSessions(
    response.data.hits?.hits.map((hit: any) => hit.fields)
  );
};

export const clob = {
  fetchSwaps,
  getClientLogs,
  getSession,
};
