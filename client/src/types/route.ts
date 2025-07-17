import MainLayout from "@/layout/MainLayout";
import History from "@/pages/History";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import Online from "@/pages/Online";
import Play from "@/pages/Play";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/play",
        Component: Play,
      },
      {
        path: "/online",
        Component: Online,
      },
      {
        path: "/history",
        Component: History,
      },
    ],
  },
  {
    path: "/match",
    Component: Match,
  },
]);
