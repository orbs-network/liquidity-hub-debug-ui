import axios from "axios";
import _ from "lodash";
import {
  getIdsFromSessions,
  parseSessions,
  normalizeSessions,
} from "../helpers";
import { SessionsFilter } from "../types";
import { createQueryBody } from "./elastic";
import BN from "bignumber.js";
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

export const getSessions = async ({
  signal,
  timeRange,
  filter,
}: {
  signal?: AbortSignal;
  timeRange?: string;
  filter?: SessionsFilter;
}) => {
  let args: Partial<FetchSessionArgs> = {
    signal,
    timeRange,
    filter,
  };
  const swapFirst = () => {
    return (
      _.size(
        filter?.must?.find(
          (f) => f.keyword === "type" || f.keyword === "swapStatus" || f.keyword === "txHash"
        )
      ) > 0
    );
  };
  
  if (!swapFirst()) {
    const serverSessions = await fetchServerSessions(args);

    const ids = getIdsFromSessions(serverSessions);

    const clientSessions = await fetchClientSessions({
      ...args,
      filter: {
        must: [{ keyword: "sessionId", value: ids }],
        should: undefined,
      },
    });

    return parseSessions(_.flatten([clientSessions, serverSessions]));
  }

  const swapSessions = await fetchServerSessions(args);

  const ids = getIdsFromSessions(swapSessions);

  const quoteSessions = fetchServerSessions({
    ...args,
    filter: {
      must: [
        {
          keyword: "sessionId",
          value: ids,
        },
        {
          keyword: "type",
          value: "quote",
        },
      ],
      should: undefined,
    },
  });

  const clientSessions = fetchClientSessions({
    ...args,
    filter: {
      must: [
        {
          keyword: "sessionId",
          value: ids,
        },
      ],
      should: undefined,
    },
  });

  const [quoteRes, clientRes] = await Promise.all([
    quoteSessions,
    clientSessions,
  ]);

  return parseSessions(_.flatten([clientRes, swapSessions, quoteRes]));
};

export async function fetchPriceParaswap(
  chainId: number,
  inToken: string,
  inTokenDecimals: number
) {
  const url = `https://apiv5.paraswap.io/prices/?srcToken=${inToken}&destToken=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&amount=${BN(
    `1e${inTokenDecimals}`
  ).toString()}&srcDecimals=${inTokenDecimals}&destDecimals=18&side=SELL&network=${chainId}`;
  try {
    const res = await axios.get(url);
    return res.data.priceRoute.srcUSD;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function fetchPrice(
  tokenAddress: string,
  chainId: number
): Promise<number> {
  try {
    const { data } = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}/`
    );

    if (!data.pairs[0]) {
      const paraPrice = await fetchPriceParaswap(
        chainId,
        tokenAddress,
        data.decimals
      );
      return paraPrice.price;
    }
    return parseFloat(data.pairs[0].priceUsd);
  } catch (e) {
    throw new Error(`fetchPrice: ${tokenAddress} failed`);
  }
}

const getTotalTokensUsdValue = async ({
  address,
  chainId,
  amount,
}: {
  address?: string;
  chainId?: number;
  amount?: string;
}) => {
  if (!address || !chainId) return "";

  const price = await fetchPrice(address, chainId);

  if (!amount || !price) return "";
  const res = BN(amount).multipliedBy(price).toString();

  return res;
};

export const api = {
  getSessions,
  fetchPrice,
  getTotalTokensUsdValue,
};
