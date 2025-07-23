/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getPublicClient } from "../lib";
import { isNativeAddress } from "@orbs-network/twap-sdk";
import { getNetworkByChainId, toAmountUI } from "../utils";
import { useToken } from "./use-tokens-query";

const abi = [
  {
    name: "observe",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        name: "accounts",
        type: "address[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "value1", type: "uint256" },
          { name: "value2", type: "uint256" },
          { name: "token", type: "address" },
        ],
      },
    ],
  },
];

export function useUsdOracleQuery({
  address,
  chainId,
  disabled,
}: {
  address?: string;
  chainId?: number;
  disabled?: boolean;
}) {
  const token = useToken(address, chainId);

  const query = useQuery({
    queryKey: ["usd-oracle", token?.address, token?.decimals, chainId],
    queryFn: async () => {
      const client = getPublicClient(chainId!);
      if (!client) {
        throw new Error("No client found");
      }
      const address = isNativeAddress(token?.address)
        ? getNetworkByChainId(chainId!)?.wToken.address
        : token?.address;
      if (!address) {
        return 0;
      }

      const result = (await client.readContract({
        address: "0xCEE0202933b3c8e562Ec4417742DDdB46bc1ada8",
        abi,
        functionName: "observe",
        args: [[address]],
      })) as any;

      return Number(toAmountUI(result[0].value1.toString(), token!.decimals));
    },
    enabled: !!token && !!chainId && !disabled,
    staleTime: Infinity, // 5 minutes
  });

  return query;
}
