import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

import { AppView } from "./views/app.view.tsx";
import { CallbackView } from "./views/auth/callback.view.tsx";
import { LoginView } from "./views/auth/login.view.tsx";
import { DashboardView } from "./views/dashboard/dashboard.view.tsx";

const root = createRootRoute();

const callback = createRoute({
  getParentRoute: () => root,
  path: "/callback",
  component: CallbackView,
});

const login = createRoute({
  getParentRoute: () => root,
  path: "/login",
  component: LoginView,
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

root.addChildren([app, login, callback]);
app.addChildren([dashboard]);

export const router = createRouter({ routeTree: root });
