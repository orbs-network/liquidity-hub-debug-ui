import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import Web3 from "web3";
import { useWeb3 } from "./hooks";
import { ClobSession, SessionsFilter } from "./types";
import BN from "bignumber.js";
import {
  amountUi,
  getChainConfig,
  getERC20Transfers,
  getTokenDetails,
} from "./helpers";
import { clob } from "applications";
import { priceUsdService } from "services/price-usd";
import { eqIgnoreCase, isNativeAddress } from "@defi.org/web3-candies";
import { FEES_ADDRESS } from "config";
export const queryKey = {
  allSessions: "allSessions",
  tokens: "tokens-logo",
  txDetails: "txDetails",
  usdPrice1Token: "usdPrice1Token",
  getSessionsByFilter: "getSessionsByFilter",
  session: "session",
  tokenAmountUsd: "tokenAmountUsd",
  tokenDetails: "tokenDetails",
};

export const useGetClobSessionsQuery = (
  filter?: SessionsFilter,
  timeRange?: string
) => {
  return useQuery({
    queryKey: [queryKey.allSessions, timeRange, filter],
    queryFn: ({ signal }) => {
      return clob.getSessions({
        signal,
        timeRange,
        filter,
      });
    },
    staleTime: Infinity,
  });
};

export const useTxDetailsQuery = (session?: ClobSession | null) => {
  const web3 = useWeb3(session?.chainId);
  return useQuery({
    queryKey: [queryKey.txDetails, session?.txHash],
    queryFn: async () => {
      if (!session) return null;
      const receipt = await web3?.eth.getTransactionReceipt(session.txHash!);

      const logs = receipt?.logs;
      if (!logs) return null;

      const transfers = await getERC20Transfers(web3!, logs!, session.chainId!);

      const getExactAmountOutTrafer = () => {
        const filtered = _.filter(
          transfers,
          (t) =>
            eqIgnoreCase(t.to, session.userAddress || "") &&
            eqIgnoreCase(t.token.address, session.tokenOutAddress || "")
        );
        
        return _.sortBy(filtered, (t) => t.value).reverse()[0];
      };
      const wToken = getChainConfig(session.chainId!)?.wToken;

      const findTransfer = (address: string) => {
        const filtered = _.find(transfers, (t) => eqIgnoreCase(t.to, address));
        return filtered;
      };
      let toTokenUSD = 0;
      let nativeTokenUSD = 0;
      try {
        nativeTokenUSD = await priceUsdService.getPrice(
          wToken?.address!,
          session.chainId!
        );
        toTokenUSD = await priceUsdService.getPrice(
          session.tokenOutAddress!,
          session.chainId!
        );
      } catch (error) {}

      const nativeTokenPerOutToken = toTokenUSD / nativeTokenUSD;

      const getFees = () => {
        const toTokenValue = findTransfer(FEES_ADDRESS)?.value || "0";
        return new BN(toTokenValue).times(nativeTokenPerOutToken).toString();
      };

      const gasUsed = Web3.utils.fromWei(receipt?.gasUsed || 0, "gwei");

      const gasPrice = Web3.utils.fromWei(
        receipt?.effectiveGasPrice || 0,
        "gwei"
      );
      console.log({ receipt });
      

      const gasUsedNativeToken = new BN(gasUsed)
        .multipliedBy(new BN(gasPrice))
        .toString();

      const exactAmountOutTransfer = getExactAmountOutTrafer();

      const fees = getFees();
      const exactAmountOut = exactAmountOutTransfer?.value;
      const toToken = await getTokenDetails(
        session.tokenOutAddress!,
        web3!,
        session.chainId!
      );
      const dutchPrice = amountUi(
        toToken.decimals,
        new BN(session.dutchPrice || "0")
      );

      const getFeesPercent = () => {
        const diff = nativeTokenUSD / toTokenUSD;

        return new BN(fees)
          .times(diff)
          .div(exactAmountOut)
          .times(100)
          .toString();
      };

      return {
        exactAmountOut,
        comparedToDutch: new BN(exactAmountOutTransfer?.value || 0)
          .div(dutchPrice)
          .toString(),
        fees,
        dutchPrice,
        feesPercent: getFeesPercent(),
        transfers: await getERC20Transfers(web3!, logs!, session.chainId!),
        gasUsedNativeToken,
        gasUsed: Web3.utils.fromWei(receipt?.effectiveGasPrice || 0, "gwei"),
        gasPrice: Web3.utils.fromWei(receipt?.effectiveGasPrice || 0, "ether"),
        blockNumber: receipt?.blockNumber.toString(),
        txStatus: receipt?.status.toString(),
      };
    },
    staleTime: Infinity,
    enabled: !!session?.txHash && !!web3 && !!session?.chainId,
  });
};

  

export const useUSDPriceQuery = (address?: string, chainId?: number) => {

  address = address === "0x0000000000000000000000000000000000000000" ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" : address;
  return useQuery({
    queryFn: async () => {
      if (!chainId || !address) return 0;

      if (isNativeAddress(address)) {
        const wToken = getChainConfig(chainId)?.wToken.address;
        if (!wToken) return 0;
        return priceUsdService.getPrice(wToken, chainId);
      }

      return priceUsdService.getPrice(address, chainId);
    },
    queryKey: [queryKey.usdPrice1Token, chainId, address],
    staleTime: Infinity,
  });
};

export const useTokenDetailsQuery = (address?: string, chainId?: number) => {
  const web3 = useWeb3(chainId);
  return useQuery({
    queryFn: async () => getTokenDetails(address!, useWeb3(chainId)!, chainId!),
    queryKey: [queryKey.tokenDetails, chainId, address],
    staleTime: Infinity,
    enabled: !!address && !!chainId && !!web3,
  });
};
