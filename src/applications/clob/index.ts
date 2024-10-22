import axios from "axios";
import _ from "lodash";
import { normalizeSessions } from "helpers";
import { parseFullSessionLogs, parseSwapLogs } from "./helpers";
import { ELASTIC_ENDPOINT } from "config";
import { queries } from "./elastic";
import { identifyAddressOrTxHash, isDebug } from "utils";
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
}: {
  page: number;
  chainId?: number;
  signal?: AbortSignal;
  walletAddress?: string;
}) => {
  const data = queries.swaps({ page, chainId, limit: 100, walletAddress });

  const logs = await fetchElastic(SERVER_URL, data, signal);
  return parseSwapLogs(logs);
};

const fetchQuoteLogs = async (sessionIds: string[], signal?: AbortSignal) => {
  let allLogs: any[] = [];
  let page = 0;
  let hasMoreData = true;

  // Loop to fetch pages until no more data is returned
  while (hasMoreData) {
    const data = queries.quote(sessionIds, page, 100);
    const logs = await fetchElastic(SERVER_URL, data, signal);

    // Check if logs were returned; if empty, stop the loop
    if (logs.length === 0) {
      hasMoreData = false; // Stop loop
    } else {
      allLogs = [...allLogs, ...logs]; // Append new logs to allLogs
      page++; // Fetch next page
    }
  }

  return allLogs;
};

const fetchClientLogs = async (sessionIds: string[], signal?: AbortSignal) => {
  let allLogs: any[] = [];
  let page = 0;
  let hasMoreData = true;

  // Loop to fetch pages until no more data is returned
  while (hasMoreData) {
    const data = queries.client(sessionIds, page, 100);
    const logs = await fetchElastic(CLIENT_URL, data, signal);

    // Check if logs were returned; if empty, stop the loop
    if (logs.length === 0) {
      hasMoreData = false; // Stop loop
    } else {
      allLogs = [...allLogs, ...logs]; // Append new logs to allLogs
      page++; // Fetch next page
    }
  }

  return allLogs;
};

const getSession = async (
  txHashOrSessionId: string,
  signal?: AbortSignal
): Promise<LHSession> => {
  let data;

  if (identifyAddressOrTxHash(txHashOrSessionId) === "txHash") {
    data = queries.transactionHash(txHashOrSessionId);
  } else {
    data = queries.sessionId(txHashOrSessionId);
  }

  const result = await fetchElastic(SERVER_URL, data, signal);
  const swapLog = result[0];

  if (!isDebug) {
    return parseFullSessionLogs(swapLog, [], []);
  }

  const quoteLogs = await fetchQuoteLogs([swapLog.sessionId], signal);
  const clientLogs = await fetchClientLogs([swapLog.sessionId], signal);

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
