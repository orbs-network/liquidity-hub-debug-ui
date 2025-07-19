
import { Outlet } from "react-router-dom";
import { Page } from "@/components";

export const RootPage = () => {
  return (
    <>
      <Page>
        <Outlet />
      </Page>
    </>
  );
};
