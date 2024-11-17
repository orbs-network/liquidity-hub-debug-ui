import BN from "bignumber.js";
import _ from "lodash";
import moment from "moment";
import { partners } from "partners";

export const isDebug = !!localStorage.getItem("debug");

export const isValidWalletAddress = (address: string) => {
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  return ethereumAddressPattern.test(address);
};

export const isValidTxHash = (txHash: string) => {
  const ethereumTxHashPattern = /^0x[a-f0-9]{64}$/;

  return ethereumTxHashPattern.test(txHash);
};

export const isValidSessionId = (sessionId: string) => {
  const regex = /^[a-zA-Z0-9]+_\d+$/;
  return regex.test(sessionId);
};

export const addSlippage = (amount?: string, slippage?: number) => {
  if (!amount || !slippage) return amount;

  const slippageBN = BN(amount).times(slippage).div(100);

  return BN(amount).plus(slippageBN).toString();
};



export const getPartnerWithExchangeAddress = (exchangeAddress?: string) => {
  return  _.find(partners, (p) => !!p.getTwapConfigByExchange(exchangeAddress))
}



export const MillisToDuration = (value?: number) => {
  if (!value) {
      return "";
  }
  const time = moment.duration(value);
  const days = time.days();
  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  const arr: string[] = [];

  if (days) {
    arr.push(`${days} days `);
  }
  if (hours) {
    arr.push(`${hours} hours `);
  }
  if (minutes) {
    arr.push(`${minutes} minutes`);
  }
  if (seconds) {
    arr.push(`${seconds} seconds`);
  }
  return arr.join(" ");
};


export function getMinDecimalScaleForLeadingZero(value?: string | number): number | undefined {
  // Convert the value to a string
  if(!value) return undefined;
  const valueStr =  typeof value === 'number' ? value.toString() : value;

  if (parseFloat(valueStr) === 0) return undefined; // If the value is 0, return undefined

  const decimalIndex = valueStr.indexOf('.');

  if (decimalIndex === -1) {
      // No decimal point, it's an integer
      return undefined;
  }

  const decimals = valueStr.slice(decimalIndex + 1);

  // Check if decimals start with '0'
  if (decimals.startsWith('0')) {
      // Count decimal places until the first non-zero digit
      for (let i = 0; i < decimals.length; i++) {
          if (decimals[i] !== '0') {
              return i + 1; // Include the first non-zero digit
          }
      }
  }

  return undefined; // Return null if decimals don't start with '0'
}