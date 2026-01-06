import { GalleryVerticalEnd } from "lucide-react";

import { Controller } from "@/lib/controller.tsx";
import { auth } from "@/services/auth.ts";

type Tenant = {
  name: string;
  logo: React.ElementType;
  domain: string;
};

export class AppSiderbarController extends Controller<{
  tenant: Tenant;
}> {
  async onInit() {
    const user = auth.user;
    if (user === undefined) {
      return {
        tenant: {
          name: "Zitadel",
          logo: GalleryVerticalEnd,
          domain: "iam.valkyrjs.com",
        },
      };
    }
    return {
      tenant: {
        name: user.tenant.name,
        logo: GalleryVerticalEnd,
        domain: user.tenant.domain,
      },
    };
  }
}
