import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useParams } from "react-router-dom";
import {
  getERC20Transfers,
  getTokenDetails,
} from "helpers";
import { queryKey } from "query";
import { clob } from "applications";
import { useWeb3 } from "hooks";

export const useToken = (tokenAddress?: string, chainId?: number) => {
  const w3 = useWeb3(chainId);

  return useQuery({
    queryKey: ["useGetToken", tokenAddress, chainId],
    queryFn: async () => {
      return getTokenDetails(tokenAddress!, w3!, chainId!);
    },
    enabled: !!tokenAddress && !!chainId && !!w3,
    staleTime: Infinity,
  }).data;
};

export const useSession = () => {
  const params = useParams();

  return useQuery({
    queryKey: [queryKey.session, params.identifier],
    queryFn: async ({ signal }) => {
      const session = await clob.getSession(params.identifier!, signal);

      return session;
    },
    staleTime: Infinity,
    enabled: !!params.identifier,
  });
};

export const useTransfers = () => {
  const session = useSession().data;
  const web3 = useWeb3(session?.chainId);
  return useQuery({
    queryKey: [queryKey.txDetails, session?.txHash],
    queryFn: async () => {
      if (!session) return null;

      const receipt = await web3?.eth.getTransactionReceipt(session.txHash!);

      const logs = receipt?.logs;
      if (!logs) return null;

      return getERC20Transfers(web3!, logs!, session.chainId!);
    },
    staleTime: Infinity,
    enabled: !!session?.txHash && !!web3 && !!session?.chainId,
  });
};
