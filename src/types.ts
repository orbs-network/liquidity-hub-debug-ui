
export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};

export interface TransferLog {
  from: string;
  to: string;
  value: string;
  token: Token;
  rawValue: string;
}
