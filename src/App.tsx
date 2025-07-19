import { Outlet } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { ConfigProvider } from "antd";
import { createGlobalStyle } from "styled-components";
import { useHeight } from "@/hooks";
import { colors } from "@/consts";

const GlobalStyle = createGlobalStyle`
  .ant-tooltip-inner {
    background: ${colors.dark.bgTooltip};
  }
`;

export function App() {
  const height = useHeight();
  return (
    <ConfigProvider>
      <GlobalStyle />
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <div style={{ minHeight: height }} className="bg-background text-white">
          <Outlet />
        </div>
      </QueryParamProvider>
    </ConfigProvider>
  );
}
