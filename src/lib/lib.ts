/* eslint-disable @typescript-eslint/no-explicit-any */

import { createPublicClient, http } from "viem";
import { getChain, normalizeSessions } from "./utils";
import axios from "axios";

export const getPublicClient = (chainId: number) => {
  const chain = getChain(chainId);
  if (!chain) return undefined;
  return createPublicClient({
    chain,
    transport: http(
      `${import.meta.env.VITE_RPC_URL}/rpc?chainId=${chainId}&appId=debug-tool`
    ),
  }) as ReturnType<typeof createPublicClient>;
};


export const fetchElastic = async <T>(
  url: string,
  data: any,
  signal?: AbortSignal
): Promise<T[]> => {
  const response = await axios.post(`${url}/_search`, { ...data }, { signal });

  return normalizeSessions(
    response.data.hits?.hits.map((hit: any) => hit.fields)
  );
};
