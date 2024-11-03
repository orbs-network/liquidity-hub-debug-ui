import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-xcode";
import { useSession } from "../hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TX_TRACE_SERVER } from "config";
import { ListItem } from "./shared";

export const useLogTrace = () => {
  const session = useSession().data;
  
  return useQuery({
    queryKey: ["useLogTrace", session?.id],
    queryFn: async ({ signal }) => {
      if (!session) return;
      const result = await axios.post(
        TX_TRACE_SERVER,
        {
          chainId: session.chainId,
          blockNumber: session.blockNumber,
          txData: session.txData,
        },
        {
          signal,
        }
      );
      return result.data;
    },
    enabled: !!session,
  });
};

export const LogTrace = () => {
  const { data, isLoading, error } = useLogTrace();

  return (
    <ListItem label="Log trace">
      <AceEditor
        mode="sh" // Set mode to shell script
        theme="XCode" // Set theme to a terminal-like theme
        value={isLoading ? "Loading..." : error ? `Error: ${error}` : data}
        readOnly={true} // Make it read-only to resemble a terminal output
        width="100%" // Adjust width as needed
        fontSize={18} // Set the font size here
      />
    </ListItem>
  );
};
