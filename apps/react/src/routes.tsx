import { createRootRoute, createRoute } from "@tanstack/react-router";

import { AppView } from "./views/app.view.tsx";
import { CallbackView } from "./views/auth/callback.view.tsx";
import { DashboardView } from "./views/dashboard/dashboard.view.tsx";

const root = createRootRoute();

const callback = createRoute({
  getParentRoute: () => root,
  path: "/callback",
  component: CallbackView,
});

const app = createRoute({
  id: "app",
  getParentRoute: () => root,
  component: AppView,
});

const dashboard = createRoute({
  getParentRoute: () => app,
  path: "/",
  component: DashboardView,
});

root.addChildren([app, callback]);
app.addChildren([dashboard]);

export const routeTree = root;
