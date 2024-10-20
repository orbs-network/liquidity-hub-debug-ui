import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ROUTES } from "./config";
import { ClobSessionPage, ClobSessionsPage, PublicPage } from "./pages";

export const router = createBrowserRouter([
  {
    path: ROUTES.main,
    element: <App />,
    children: [
      {
        element: <ClobSessionsPage searchBy="all" />,
        index: true,
      },
      {
        path: ROUTES.clobSessionsByAddress,
        element: <ClobSessionsPage searchBy="address" />,
      },
      {
        path: ROUTES.clobSession,
        element: <ClobSessionPage />,
      },
      {
        path: ROUTES.public,
        element: <PublicPage  />,
      },

      {
        path: "*",
        element: <Navigate to={ROUTES.main} />,
      },
    ],
  },
]);
