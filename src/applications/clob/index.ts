import axios from "axios";
import _ from "lodash";
import {
  datesDiff,
  getIdsFromSessions,
  getValueFromSessionLogs,
  normalizeSessions,
} from "helpers";
import { ClobSession, SessionsFilter } from "types";
import { elastic } from "services/elastic";
import moment from "moment";
import { bn, chainId } from "@defi.org/web3-candies";
import { useUSDPriceQuery } from "query";
import { useNumberFormatter } from "hooks";
import { useSessionChainConfig, useSessionTx } from "pages/clob/public/hooks";

interface FetchSessionArgs {
  url: string;
  filter?: SessionsFilter;
  timeRange?: string;
  signal?: AbortSignal;
}

class Clob {
  SERVER_SESSIONS = "orbs-clob-poc10.*";
  CLIENT_SESSIONS = "orbs-liquidity-hub-ui*";

  parseSessions = (sessions: any[]) => {
    const grouped = _.mapValues(_.groupBy(sessions, "sessionId"), (value) => {
      return _.groupBy(value, "type");
    });
    
    const sessionValues = _.mapValues(grouped, (session, key): ClobSession => {
      console.log({"session.quote": session})
      const fromSwap = (key: string) =>
        getValueFromSessionLogs(session.swap, key);
      const fromQuote = (key: string) =>
        getValueFromSessionLogs(session.quote, key) || fromSwap(key);
      const fromClient = (key: string) =>
        getValueFromSessionLogs(session.client, key);
      let timestamp =
        fromSwap("timestamp") ||
        fromQuote("timestamp") ||
        fromClient("timestamp");
        
      let dexAmountOut =   bn(fromClient("dexOutAmountWS")).toString() || fromQuote("amountOutUI");
      const timestampMillis = moment(timestamp).valueOf();
      const savings = fromSwap("exactOutAmountSavings");
      const amountOutRaw = fromQuote("amountOut") || fromClient("amountOut");
      const amountOutF = fromQuote("amountOutF");
      const exactOutAmount = fromSwap("exactOutAmount");
      const txData = fromSwap("txData");


      // const tx = useSessionTx();
      // const chainConfig = useSessionChainConfig();
      // //@ts-ignore
      // const gasUsedNative = Number(useNumberFormatter({ value: tx?.gasUsedNativeToken }))
      // const nativePrice = useUSDPriceQuery(chainConfig?.native.address, chainId);
      // const gasUsedNativeUSD = gasUsedNative!! * nativePrice!!;

      return {
        id: key,
        amountInRaw: fromQuote("amountIn") || fromClient("amountIn"),
        amountInUI: fromQuote("amountInF") || fromClient("srcAmountUI"),
        amountOutRaw: amountOutRaw,

        //@ts-ignore
        amountOutF: amountOutF,
        timestampMillis,
        timestamp: moment(timestamp).format("DD/MM/YY HH:mm:ss"),
        timeFromNow: datesDiff(moment(timestampMillis)),
        dexSwapTxHash: fromClient("dexSwapTxHash"),
        dutchPrice: fromSwap("dutchPrice"),
        amountOut: fromQuote("amountOut"),
        dexAmountOut: dexAmountOut,
        amountOutDiff:
          dexAmountOut === -1
            ? ""
            : fromSwap("amountOutDiff") ||
              fromQuote("amountOutDiff") ||
              (fromClient("clobDexPriceDiffPercent") &&
                fromClient("clobDexPriceDiffPercent") / 10),
        amountOutUSD:
          fromSwap("dollarValue") ||
          fromQuote("dollarValue") ||
          fromClient("dstTokenUsdValue"),
        amountInUSD: fromSwap("amountInUSD") || fromClient("amountInUSD"),
        isAction: fromSwap("isAction") || fromClient("isAction"),
        isClobTrade: fromClient("isClobTrade"),
        slippage:
          fromSwap("slippage") ||
          fromQuote("slippage") ||
          fromClient("slippage"),
        tokenOutAddress:
          fromSwap("tokenOutAddress") ||
          fromQuote("tokenOutAddress") ||
          fromClient("dstTokenAddress"),
        tokenInAddress:
          fromSwap("tokenInAddress") ||
          fromQuote("tokenInAddress") ||
          fromClient("srcTokenAddress"),
        tokenOutSymbol:
          fromSwap("tokenOutSymbol") ||
          fromQuote("tokenOutSymbol") ||
          fromClient("dstTokenSymbol"),
        txStatus: fromSwap("txStatus"),
        tokenInSymbol:
          fromSwap("tokenInSymbol") ||
          fromQuote("tokenInSymbol") ||
          fromClient("srcTokenSymbol"),
        uaServer: fromSwap("uaServer") || fromClient("uaServer"),
        chainId:
          fromSwap("chainId") || fromQuote("chainId") || fromClient("chainId"),
        dex: fromSwap("dex") || fromQuote("dex") || fromClient("partner"),
        userAddress:
          fromSwap("user") ||
          fromQuote("userAddress") ||
          fromClient("walletAddress"),
        ip: fromSwap("ip") || fromClient("ip"),
        serializedOrder:
          fromSwap("serializedOrder") || fromClient("serializedOrder"),
        signature: fromSwap("signature") || fromClient("signature"),
        swapStatus: fromSwap("swapStatus") || fromClient("swapStatus"),
        txHash: fromSwap("txHash") || fromClient("txHash"),
        gasPriceGwei: fromSwap("gasPriceGwei") || fromClient("gasPriceGwei"),
        gasUsed: fromSwap("gasUsed") || fromClient("gasUsed"),
        exactOutAmount: exactOutAmount,
        exactOutAmountUsd: fromSwap("exactOutAmountUsd"),
        savings: savings,
        txData,
        blockNumber: fromSwap("blockNumber") || fromClient("blockNumber"),
        logs: {
          client: session.client,
          swap: session.swap,
          quote: session.quote,
        },
      };
    });

    const _sessions = _.values(sessionValues);
    return _.sortBy(_sessions, "timestampMillis").reverse();
  };

  getSessions = async ({
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
            (f) =>
              f.keyword === "type" ||
              f.keyword === "swapStatus" ||
              f.keyword === "txHash"
          )
        ) > 0
      );
    };

    if (!swapFirst()) {
      const serverSessions = await this.fetchServerSessions(args);

      const ids = getIdsFromSessions(serverSessions);

      const clientSessions = await this.fetchClientSessions({
        timeRange: args.timeRange,
        signal: args.signal,
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

      return this.parseSessions(_.flatten([clientSessions, serverSessions]));
    }

    const swapSessions = await this.fetchServerSessions(args);

    const ids = getIdsFromSessions(swapSessions);

    const quoteSessions = this.fetchServerSessions({
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

    const clientSessions = this.fetchClientSessions({
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

    return this.parseSessions(_.flatten([clientRes, swapSessions, quoteRes]));
  };

  async fetchSessions({ url, filter, timeRange, signal }: FetchSessionArgs) {
    const data = elastic.createQueryBody({
      filter: filter && _.size(filter) ? filter : undefined,
      timeRange,
    });
    

    const response = await axios.post(
      `${elastic.endpoint}/${url}/_search`,
      { ...data },
      { signal: signal }
    );

    return normalizeSessions(
      response.data.hits?.hits.map((hit: any) => hit.fields)
    );
  }
  async fetchServerSessions(args: Partial<FetchSessionArgs>) {
    return this.fetchSessions({ url: this.SERVER_SESSIONS, ...args });
  }

  async fetchClientSessions(args: Partial<FetchSessionArgs>) {
    const sessions = await this.fetchSessions({
      url: this.CLIENT_SESSIONS,
      ...args,
    });
    return sessions.map((session) => {
      return {
        ...session,
        type: "client",
      };
    });
  }
}

export const clob = new Clob();
