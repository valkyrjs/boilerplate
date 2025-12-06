import { makeControllerComponent } from "@/lib/controller.tsx";

import { DashboardController } from "./dashboard.controller.ts";

export const DashboardView = makeControllerComponent(DashboardController, () => {
  return <div>Dashboard</div>;
});
