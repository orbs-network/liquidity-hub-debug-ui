import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { Navbar } from "./components";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { useEffect } from "react";
import { theme } from "./theme";

function App() {
  useEffect(() => {
    document.title = "Liquidity Hub Explorer";
  }, []);

  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <ThemeProvider theme={theme}>
        <ChakraProvider>
          <Layout>
            <Navbar />
            <Outlet />
          </Layout>
        </ChakraProvider>
      </ThemeProvider>
    </QueryParamProvider>
  );
}

export default App;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  padding: 30px;
  margin: 0 auto;
  gap: 30px;
  padding-top: 100px;
`;
