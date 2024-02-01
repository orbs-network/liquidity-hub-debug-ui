import { erc20abi } from "@defi.org/web3-candies";
import _ from "lodash";
import moment, { Moment } from "moment";
import Web3 from "web3";
import {
  BSC_RPC,
  CHAIN_CONFIG,
  POLYGON_INFURA_RPC,
} from "./config";
import BN from "bignumber.js";
import { amountUi } from "./query";
import { priceUsdService } from "services/price-usd";
export const getValueFromSessionLogs = (data?: any, key?: string) => {
  const arr = _.flatten(data);
  if (!key || !data) return undefined;
  return (
    _.find(arr, (value: any) => {
      return value[key];
    }) as any | undefined
  )?.[key];
};


export const normalizeSessions = (sessions: any[]) => {
  return _.map(sessions, (session) => {
    return _.mapValues(session, (value) => {
      if (Array.isArray(value) && _.size(value) === 1) {
        value = _.first(value);
      }

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      } else {
        return value;
      }
    });
  });
};

export const getExplorer = (chainId?: number) => {
  if (!chainId) return "";
  switch (chainId) {
    case 137:
      return "https://polygonscan.com";
    case 56:
      return "https://bscscan.com";
    default:
      break;
  }
};

export const getRpc = (chainId?: number) => {
  if (!chainId) return undefined;
  let rpc = "";
  switch (chainId) {
    case 137:
      rpc = POLYGON_INFURA_RPC;
      break;
    case 56:
      rpc = BSC_RPC;
      break;
    default:
      break;
  }

  return rpc
};


export const getWeb3 = (chainId?: number) => {
  const rpc = getRpc(chainId);
  if (!rpc) return undefined;
  return new Web3(new Web3.providers.HttpProvider(rpc));
}

export const getIdsFromSessions = (sessions: any[]) => {
  return _.map(sessions, (session) => session.sessionId).filter(
    (id) => id !== undefined
  ) as string[];
};

export const getChainName = (chainId?: number) => {
  if (!chainId) return "";
  switch (chainId) {
    case 137:
      return "Polygon";
    case 56:
      return "BSC";
    default:
      break;
  }
};

export const makeElipsisAddress = (address?: string, padding = 6): string => {
  if (!address) return "";
  return `${address.substring(0, padding)}...${address.substring(
    address.length - padding
  )}`;
};

export const swapStatusText = (status?: string) => {
  if (!status) return "-";
  switch (status) {
    case "success":
      return "Success";
    case "failed":
      return "Failed";
    default:
      return "-";
  }
};

export const getContract = (web3: Web3, address: string) =>
  new web3.eth.Contract(erc20abi as any, address);

export function convertScientificStringToDecimal(
  scientificString: string,
  decimals: number
) {
  // Check if the input string is in scientific notation
  if (isScientificStringToDecimal(scientificString)) {
    // Convert scientific notation string to decimal string
    let decimalString = parseFloat(scientificString).toFixed(decimals);
    return decimalString;
  } else {
    // If not in scientific notation, return the original string
    return scientificString;
  }
}

export const isScientificStringToDecimal = (scientificString: string) => {
  // Check if the input string is in scientific notation
  if (/e/i.test(scientificString)) {
    return true;
  } else {
    return false;
  }
};

export const isTxHash = (value?: string) => value?.startsWith("0x");

export const getERC20Transfers = async (
  web3: Web3,
  logs: any[],
  chainId: number
) => {
  const res = await Promise.all(
    logs.map(async (log) => {
      let parsed = undefined;

      if (_.size(log.topics) !== 3) return undefined;
      try {
        parsed = web3.eth.abi.decodeLog(
          [
            {
              type: "uint256",
              name: "amount",
            },
            {
              type: "address",
              name: "myNumber",
              indexed: true,
            },
            {
              type: "address",
              name: "fromAddress",
              indexed: true,
            },
            {
              type: "address",
              name: "toAddress",
              indexed: true,
            },
          ],
          log.data as string,
          log.topics as string[]
        );
      } catch (error) {
        return undefined;
      }

      if (parsed && Number(parsed.amount) > 0) {
        const payTokenContract = getContract(web3, log.address);
        let decimals;
        let symbol;
        try {
          decimals = (await payTokenContract.methods.decimals().call()) as any;
          symbol = (await payTokenContract.methods.symbol().call()) as any;
        } catch (error) {
          console;
          return undefined;
        }
        if (!decimals) return;
        const tokenAmount = amountUi(
          Number(web3.utils.fromWei(decimals, "wei")),
          new BN(web3.utils.fromWei(parsed.amount as string, "wei"))
        );

        // const [fullNum,  _decimals] = tokenAmount.split(".");

        // if (
        //   eqIgnoreCase(REACTOR_ADDRESS, parsed.fromAddress as string) ||
        //   eqIgnoreCase(REACTOR_ADDRESS, parsed.toAddress as string) ||
        //   eqIgnoreCase(parsed.fromAddress as string, parsed.toAddress as string)
        // ) {
        //   return undefined;
        // }

        let priceUsd = "0";

        try {
          priceUsd = await priceUsdService.getTotalTokensPrice({
            address: log.address,
            chainId,
            amount: tokenAmount,
          });
        } catch (error) {
          console.error(error);
        }

        return {
          tokenAmount,
          fromAddress: parsed.fromAddress as string,
          toAddress: parsed.toAddress as string,
          tokenAddress: log.address as string,
          tokenSymbol: symbol as string,
          priceUsd,
        };
      }
    })
  );

  return _.uniqBy(_.compact(res), (v) => [v.fromAddress, v.toAddress].join());
};

export const getChainConfig = (chainId?: number) => {
  if (!chainId) return undefined;
  return CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
};

export const datesDiff = (date: Moment) => {
  const duration = moment.duration(moment().diff(date));
  const years = duration.asYears();
  const days = duration.asDays();
  const hours = duration.asHours();
  const minutes = duration.asMinutes();
  const seconds = duration.asSeconds();

  if (years > 1) {
    return `${Math.floor(years)} years ago`;
  }

  if (days > 1) {
    return `${Math.floor(days)} days ago`;
  }

  if (hours > 1) {
    return `${Math.floor(hours)} hours ago`;
  }

  if (minutes > 1) {
    return `${Math.floor(minutes)} minutes ago`;
  }

  if (seconds > 1) {
    return `${Math.floor(seconds)} seconds ago`;
  }
};
