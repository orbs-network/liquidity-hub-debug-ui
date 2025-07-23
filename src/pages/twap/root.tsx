import { Page } from "@/components";
import { Outlet } from "react-router-dom";


export const MainPage = () => {
  return (
    <Page>
      <Outlet />
    </Page>
  );
};
