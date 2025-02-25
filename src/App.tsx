import { Outlet } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { ConfigProvider, ThemeConfig } from "antd";
import { styled, createGlobalStyle } from "styled-components";
import { useHeight } from "hooks";
import { colors } from "consts";

const GlobalStyle = createGlobalStyle`
  .ant-tooltip-inner {
    background: ${colors.dark.bgTooltip};
  }
`;

const theme: ThemeConfig = {
  token: {
    fontFamily: '"IBM Plex Mono", monospace',
  },

  components: {
    Skeleton: {
      gradientFromColor: "rgba(255, 255, 255, 0.1)",
    },
    Typography: {
      colorText: colors.dark.textMain,
    },
    Tooltip: {
      fontSize: 12,

    },
  },
};

export function App() {
  const height = useHeight();
  return (
    <ConfigProvider theme={theme}>
      <GlobalStyle />
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Container style={{ minHeight: height }}>
          <Outlet />
        </Container>
      </QueryParamProvider>
    </ConfigProvider>
  );
}

const Container = styled("div")({
  background: colors.dark.bgMain,
});
