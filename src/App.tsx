import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { theme } from "./theme";

export function App() {
  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <ThemeProvider theme={theme}>
        <ChakraProvider>
          <Outlet />
        </ChakraProvider>
      </ThemeProvider>
    </QueryParamProvider>
  );
}


