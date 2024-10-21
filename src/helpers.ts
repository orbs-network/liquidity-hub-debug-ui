import { erc20abi,  isNativeAddress, parsebn, zero } from "@defi.org/web3-candies";
import _ from "lodash";
import moment, { Moment } from "moment";
import Web3 from "web3";
import BN from "bignumber.js";
import { ethers } from "ethers";
import { Token, TransferLog } from "types";
import { networks } from "networks";
export const getValueFromSessionLogs = (data?: any, key?: string) => {
  const arr = _.flatten(data);
  if (!key || !data) return undefined;
  return (
    _.find(arr, (value: any) => {
      return !_.isNaN(value[key]);
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
    case 59144:
      return "https://lineascan.build"
    case 8453:
      return "https://sepolia.scrollscan.com"
    case 250:
      return "https://ftmscan.com"
    default:
      break;
  }
};

export const getLogo = (chainId?: number) => {
  if (!chainId) return "";
  switch (chainId) {
    case 137:
      return "https://polygonscan.com";
    case 56:
      return "https://bscscan.com";
  }
}

export const getRpcUrl = (chainId?: number) => {
  if (!chainId) return undefined;
  return `https://rpcman.orbs.network/rpc?chainId=${chainId}&appId=liquidity-hub-debug-tool`;
};

export const getWeb3 = (chainId?: number) => {
  const rpc = getRpcUrl(chainId);
  if (!rpc) return undefined;
  return new Web3(new Web3.providers.HttpProvider(rpc));
};

export const getIdsFromSessions = (sessions: any[]) => {
  return _.uniq(_.map(sessions, (session) => session.sessionId).filter(
    (id) => id !== undefined)
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
      return "✅ Success";
    case "failed":
      return "❌ Failed";
    default:
      return "-";
  }
};

export const getContract = (web3: Web3, address: string) => {
  return new web3.eth.Contract(erc20abi as any, address);
}

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

export const getChainConfig = (chainId?: number) => {
  if (!chainId) return undefined;
  return networks[chainId as keyof typeof networks];
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

const ERC20_TRANSFER_EVENT_TOPIC = ethers.id(
  "Transfer(address,address,uint256)"
);

export async function getTokenDetails(
  tokenAddress: string,
  web3: Web3,
  chainId: number
): Promise<Token> {
  const config = getChainConfig(chainId);
  if (isNativeAddress(tokenAddress)) {
    return config?.native as any as Token;
  }

  if (isNativeAddress(tokenAddress)) {
    return getChainConfig(chainId)?.native as any as Token;
  }

  const contract = new web3.eth.Contract(erc20abi as any, tokenAddress);

  const [name, symbol, decimals] = await Promise.all([
    contract.methods.name().call(),
    contract.methods.symbol().call(),
    contract.methods.decimals().call(),
  ]);

  return {
    name: name as any as string,
    symbol: symbol as any as string,
    decimals: parseInt((decimals as any).toString()),
    address: tokenAddress,
  };
}

export const getERC20Transfers = async (
  web3: Web3,
  logs: any[],
  chainId: number
): Promise<TransferLog[]> => {
  const iface = new ethers.Interface(erc20abi as any);
  const transferLogs = logs.filter(
    (log) => log.topics[0] === ERC20_TRANSFER_EVENT_TOPIC
  );

  const transfersP = transferLogs.map(async (log) => {
    return {
      parsed: iface.parseLog(log),
      address: log.address,
      token: await getTokenDetails(log.address, web3, chainId),
    };
  });

  const transfers = await Promise.all(transfersP);
  const result = transfers.map((transfer) => {
    if (!transfer.parsed) return undefined;
    const decimals = transfer.token?.decimals
      ? new BN(transfer.token?.decimals as any).toNumber()
      : undefined;

    return {
      from: transfer.parsed.args.from,
      to: transfer.parsed.args.to,
      value: amountUi(decimals, new BN(transfer.parsed.args.value)),
      token: transfer.token,
      rawValue: transfer.parsed.args.value.toString(),
    };
  });

  return _.compact(result);
};


export const amountBN = (decimals?: number, amount?: string) => {
  if (!decimals || !amount) return zero;

  return parsebn(amount).times(new BN(10).pow(decimals || 0));
};

export const amountUi = (decimals?: number, amount?: BN) => {
  if (!decimals || !amount) return "";
  const percision = new BN(10).pow(decimals || 0);
  return convertScientificStringToDecimal(
    amount.times(percision).idiv(percision).div(percision).toString(),
    decimals
  );
};

export const amountUiV2 = (decimals?: number, amount?: string | BN) => {
  amount = amount?.toString()
  
    
  if (!decimals || !amount) return "";
  const percision = new BN(10).pow(decimals || 0);
  return BN(amount).times(percision).idiv(percision).div(percision).toFixed();
};
