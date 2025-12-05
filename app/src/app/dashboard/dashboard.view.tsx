import { makeControllerComponent } from "@/lib/controller.tsx";

import { DashboardController } from "./dashboard.controller.ts";

export const DashboardView = makeControllerComponent(DashboardController, ({ beneficiaries }) => {
  return (
    <div>
      Dashboard
      <pre>{JSON.stringify(beneficiaries, null, 2)}</pre>
    </div>
  );
});
