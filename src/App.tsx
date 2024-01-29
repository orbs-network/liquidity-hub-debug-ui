import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Navbar } from "./components";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { useEffect, useState } from "react";


const useHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
}

function App() {
  const height = useHeight();
  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <ChakraProvider>
        <Layout style={{
          minHeight: height
        }}>
          <Navbar />
          <Outlet />
        </Layout>
      </ChakraProvider>
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
`;
