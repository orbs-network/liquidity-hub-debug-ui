import { Outlet } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { ConfigProvider } from "antd";
import { Toaster } from "sonner"


export function App() {
  return (
    <ConfigProvider>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <div className="bg-background text-white">
          <Outlet />
          <Toaster />
        </div>
      </QueryParamProvider>
    </ConfigProvider>
  );
}
