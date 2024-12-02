import _ from "lodash";
import { useAppParams } from "hooks";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Page } from "components";
import { RowFlex } from "styles";
import { Filters } from "components/Filters";
import { ROUTES, TWAP_ROUTER_PATHS } from "config";

const Navbar = () => {
  const pathname = useLocation().pathname;
  const hideFilters = useMemo(() => {
    if (pathname.includes(TWAP_ROUTER_PATHS.order)) {
      return true;
    }
  
  }, [pathname]);

  return (
    <Page.Navbar>
      <Page.Navbar.Logo text="TWAP Eplorer" path={ROUTES.twap.root} />
      <RowFlex style={{ flex: 1, justifyContent: "flex-end" }}>
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

export const RootPage = () => {
  const { query, setQuery } = useAppParams();

  useEffect(() => {
    if (!query.chainId) {
      setQuery({ chainId: 1 });
    }
  }, [query.chainId]);

  return (
    <>
      <Page navbar={<Navbar />}>
        <Outlet />
      </Page>
    </>
  );
};
