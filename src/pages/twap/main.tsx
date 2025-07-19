import { Page } from "@/components";
import { ROUTES } from "@/config";
import { Outlet } from "react-router-dom";

const navigation = [
  {
    title: "Overview",
    path: ROUTES.twap.overview,
  },
  {
    title: "Orders",
    path: ROUTES.twap.root,
  },
];

export const MainPage = () => {
  return (
    <Page navigation={navigation}>
      <Outlet />
    </Page>
  );
};
