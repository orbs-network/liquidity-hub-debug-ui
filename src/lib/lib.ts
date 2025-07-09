import { getChain } from "@/helpers";
import { TransferLog } from "@/types";
import {
  createPublicClient,
  decodeEventLog,
  erc20Abi,
  http,
  keccak256,
  toBytes,
  TransactionReceipt,
} from "viem";

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

const ERC20_TRANSFER_EVENT_TOPIC = keccak256(
  toBytes("Transfer(address,address,uint256)")
);

export const getERC20Transfers = async (
  receipt: TransactionReceipt
): Promise<TransferLog[]> => {
  const transferLogs = receipt.logs.filter(
    (log) => log.topics[0]?.toLowerCase() === ERC20_TRANSFER_EVENT_TOPIC
  );

  const transfersP = transferLogs.map(async (log) => {
    try {
      const parsedLog = decodeEventLog({
        abi: erc20Abi,
        data: log.data,
        topics: log.topics,
        eventName: "Transfer",
      });

      return {
        parsedLog,
        tokenAddress: log.address,
      };
    } catch {
      return undefined;
    }
  });

  const transfers = (await Promise.all(transfersP)).filter(Boolean);

  return transfers.filter(Boolean).map((transfer) => {
    const { args } = transfer!.parsedLog;

    return {
      from: args.from,
      to: args.to,
      value: args.value.toString(),
      tokenAddress: transfer!.tokenAddress,
    };
  });
};
