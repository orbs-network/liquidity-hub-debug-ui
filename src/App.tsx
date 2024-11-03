import { Outlet } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { ConfigProvider, ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {

  },
  components: {
    Button: {},
  },
};

export function App() {
  return (
    <ConfigProvider theme={theme}>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Outlet />
      </QueryParamProvider>
    </ConfigProvider>
  );
}
