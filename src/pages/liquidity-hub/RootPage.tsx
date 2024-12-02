import _ from "lodash";
import { Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { Page } from "components";
import { Filters } from "components/Filters";
import { RowFlex } from "styles";
import { LIQUIDITY_HUB_ROUTER_PATHS, ROUTES } from "config";
import { LiquidityHubSearchInput } from "./components/LiquidityHubSearchInput";

export const Navbar = () => {
  const pathname = useLocation().pathname;

  const showFilters = useMemo(() => {
    if(pathname.includes(LIQUIDITY_HUB_ROUTER_PATHS.transactions)) {
      return true
    }
    if(pathname.includes(LIQUIDITY_HUB_ROUTER_PATHS.user)) {
      return true
    }
  }, [pathname]);

  const showInput = useMemo(() => {
    if(pathname.includes(LIQUIDITY_HUB_ROUTER_PATHS.tx)) {
      return true
    }
    if(pathname.includes(LIQUIDITY_HUB_ROUTER_PATHS.user)) {
      return true
    }
    if(pathname.includes(LIQUIDITY_HUB_ROUTER_PATHS.transactions)) {
      return true
    }
  }, [pathname]);


  return (
    <Page.Navbar>
      <Page.Navbar.Logo text="Liquidity Hub Explorer" path={ROUTES.liquidityHub.root} />
      <RowFlex style={{ flex: 1, justifyContent: "flex-end" }}>
        {showInput && (
          <Page.Navbar.InputContainer Input={<LiquidityHubSearchInput />} />
        )}
        {showFilters && (
          <>
            <Filters.Chain />
            <Filters.Partner />
          </>
        )}
      </RowFlex>
    </Page.Navbar>
  );
};

export const RootPage = () => {
  return (
    <>
      <Page navbar={<Navbar />}>
        <Outlet />
      </Page>
    </>
  );
};
