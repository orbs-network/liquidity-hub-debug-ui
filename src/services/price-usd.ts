import axios from "axios";
import _ from "lodash";
import BN from "bignumber.js";

 async function fetchPriceParaswap(
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

async function getPrice(
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
