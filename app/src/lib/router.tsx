import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";

import { AppView } from "@/app/app.view.tsx";
import { CallbackView } from "@/app/auth/callback.view.tsx";
import { LoginView } from "@/app/auth/login.view.tsx";
import { DashboardView } from "@/app/dashboard/dashboard.view.tsx";
import { zitadel } from "@/services/zitadel.ts";

import { PaymentDashboardView } from "../app/payment/dashboard/dashboard.view.tsx";

const root = createRootRoute();

const callback = createRoute({
  getParentRoute: () => root,
  path: "/auth/callback",
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
  beforeLoad: async () => {
    const user = await zitadel.userManager.getUser();
    if (user === null) {
      throw redirect({ to: "/login" });
    }
    if (user.expired === true) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppView,
});

const dashboard = createRoute({
  getParentRoute: () => app,
  path: "/",
  component: DashboardView,
});

const payment = [
  createRoute({
    getParentRoute: () => app,
    path: "/payment",
    component: PaymentDashboardView,
  }),
];

root.addChildren([app, login, callback]);
app.addChildren([dashboard, ...payment]);

export const router = createRouter({ routeTree: root });
