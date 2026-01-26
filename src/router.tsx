import Home from "./pages/Home";
import Greeting from "./pages/greeting";
import Fortune from "./pages/fortune";
import NotFound from "./pages/NotFound";

export const routers = [
    {
      path: "/",
      name: 'home',
      element: <Home />,
    },
    {
      path: "/greeting",
      name: 'greeting',
      element: <Greeting />,
    },
    {
      path: "/fortune",
      name: 'fortune',
      element: <Fortune />,
    },
    /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
    {
      path: "*",
      name: '404',
      element: <NotFound />,
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;