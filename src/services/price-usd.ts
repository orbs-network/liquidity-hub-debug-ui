import _ from "lodash";
import BN from "bignumber.js";
import { isNativeAddress } from "@defi.org/web3-candies";
import { getChainConfig } from "helpers";



async function getPrice(
  tokenAddress: string,
  chainId: number
): Promise<number> {
  const res = await fetchLLMAPrice(tokenAddress, chainId);
  return res?.priceUsd;
}

const getTotalTokensPrice = async ({
  address,
  chainId,
  amount,
}: {
  address?: string;
  chainId?: number;
  amount?: string;
}) => {
  if (!address || !chainId) return "";

  const price = await getPrice(address, chainId);

  if (!amount || !price) return "";
  const res = BN(amount).multipliedBy(price).toString();

  return res;
};

export const priceUsdService = {
  getPrice,
  getTotalTokensPrice,
};

const chainIdToName: { [key: number]: string } = {
  56: "bsc",
  137: "polygon",
  8453: "base", // Assuming this ID is another identifier for Polygon as per the user's mapping
  250: "fantom",
  1: "ethereum",
  1101: "zkevm",
  81457: "blast",
  59144: "linea",
  42161: "arbitrum",
};

export async function fetchLLMAPrice(token: string, chainId: number) {
  const nullPrice = {
    priceUsd: 0,
    priceNative: 0,
    timestamp: Date.now(),
  };
  try {
    const chainName = chainIdToName[chainId] || "Unknown Chain";

    if (isNativeAddress(token)) {
      const wToken = getChainConfig(chainId)?.wToken;
      if (!wToken) return;
      token = wToken.address;
    }
    const tokenAddressWithChainId = `${chainName}:${token}`;
    const url = `https://coins.llama.fi/prices/current/${tokenAddressWithChainId}`;
    const response = await fetch(url);
    if (!response.ok) {
      return nullPrice;
    }
    const data = await response.json();
    const coin = data.coins[tokenAddressWithChainId];
    return {
      priceUsd: coin.price,
      priceNative: coin.price,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Failed to fetch Llama price", error);
    return nullPrice;
  }
}
