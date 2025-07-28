import ReactJson from "react-json-view";

export const LogDisplay = ({ logs }: { logs: object | object[] }) => {
    return (
      <ReactJson
        src={logs}
        name={false}
        collapsed={1}
        enableClipboard={true}
        displayDataTypes={false}
        theme="monokai"
        style={{
          fontSize: "14px",
          fontFamily: "monospace",
        }}
      />
    );
  };
