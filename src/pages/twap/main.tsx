import _ from "lodash";
import { useNavigateWithParams } from "@/hooks";
import { Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { Page } from "@/components";
import { RowFlex } from "@/styles";
import { Filters } from "@/components/Filters";
import { ROUTES, TWAP_ROUTER_PATHS } from "@/config";
import { Typography } from "antd";
import { styled } from "styled-components";
const isDebug = localStorage.getItem("debug");

const DebugComponents = () => {
  const navigate = useNavigateWithParams();

  if (!isDebug) return null;

  return (
    <StyledButton onClick={() => navigate(ROUTES.twap.orders)}>
      <Typography>Orders</Typography>
    </StyledButton>
  );
};

const StyledButton = styled("div")({
  marginRight: 8,
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "white",
});

const Navbar = () => {
  const pathname = useLocation().pathname;

  const hideFilters = useMemo(() => {
    if (_.last(pathname.split("/")) === TWAP_ROUTER_PATHS.order) {
      return true;
    }
  }, [pathname]);

  return (
    <Page.Navbar>
      <Page.Navbar.Logo text="TWAP Explorer" path={ROUTES.twap.root} />

      <RowFlex style={{ flex: 1, justifyContent: "flex-end" }}>
        <DebugComponents />
        {!hideFilters && (
          <>
            <Filters.Chain />
            <Filters.Partner />
          </>
        )}
      </RowFlex>
    </Page.Navbar>
  );
};

export const MainPage = () => {

  return (
    <>
      <Page navbar={<Navbar />}>
        <Outlet />
      </Page>
    </>
  );
};
