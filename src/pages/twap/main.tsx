import { Page } from "@/components";
import { ROUTES } from "@/config";
import { ListIcon, PieChartIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

const navigation = [
  {
    title: <>Overview <PieChartIcon className="w-4 h-4" /> </>,
    path: ROUTES.twap.overview,
  },
  {
    title: <>Orders <ListIcon className="w-4 h-4" /> </>,
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
