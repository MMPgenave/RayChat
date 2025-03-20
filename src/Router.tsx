import { createBrowserRouter } from "react-router-dom";
import { Applayout } from "./components/layouts/AppLayout";
import NoMatch from "./pages/NoMatch";
import Home from "./pages/Home";
import Agent from "./pages/Agent";
import Client from "./pages/Cient";
import ClientChatPage from "./pages/ClientChatPage";
import AgentChatPage from "./pages/AgentChatPage";
import Dashboard from "./pages/Dashboard";
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Applayout />,
      children: [
        {
          path: "",
          element: null,
        },
        {
          path: "client",
          element: <Client />,
        },
        {
          path: "agent",
          element: <Agent />,
        },
        {
          path: "clientChat",
          element: <ClientChatPage />,
        },
        {
          path: "agentChat",
          element: <AgentChatPage />,
        },
      ],
    },

    {
      path: "*",
      element: <NoMatch />,
    },
  ],
  {
    basename: global.basename,
  }
);
