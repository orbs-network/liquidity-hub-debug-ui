import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { Navbar } from "./components";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { useEffect, useState } from "react";
import { theme } from "./theme";

const useHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
};

function App() {
  const height = useHeight();

  useEffect(() => {
    document.title = "Liquidity Hub Explorer";
  }, []);

  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <ThemeProvider theme={theme}>
        <ChakraProvider>
          <Layout
            style={{
              minHeight: height,
            }}
          >
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
  max-width: 1400px;
  padding: 30px;
  margin: 0 auto;
  gap: 30px;
`;
