import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

import { Controller } from "@/lib/controller.tsx";

type Tenant = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export class TenantSwitcherController extends Controller<{
  activeTenant?: Tenant;
  tenants: Tenant[];
}> {
  async onInit() {
    return {
      activeTenant: {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      tenants: [
        {
          name: "Acme Inc",
          logo: GalleryVerticalEnd,
          plan: "Enterprise",
        },
        {
          name: "Acme Corp.",
          logo: AudioWaveform,
          plan: "Startup",
        },
        {
          name: "Evil Corp.",
          logo: Command,
          plan: "Free",
        },
      ],
    };
  }

  setActiveTenant(tenant: Tenant) {
    this.setState("activeTenant", tenant);
  }
}
