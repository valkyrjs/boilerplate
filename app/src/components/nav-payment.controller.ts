import type { Beneficiary } from "@module/payment/client";
import { Book, CirclePlusIcon, type LucideIcon, SquareTerminal } from "lucide-react";
import type { FunctionComponent } from "react";

import { DialogCreateBeneficiary } from "@/components/beneficiary/create.component.tsx";
import { loadBeneficiaries, payment } from "@/database/payment.ts";
import { Controller } from "@/lib/controller.tsx";
import { auth } from "@/services/auth.ts";

export class NavPaymentController extends Controller<{
  items: MenuItem[];
}> {
  #subscriptions: any[] = [];

  async onInit() {
    await this.#subscribe();
    return {
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: SquareTerminal,
        },
      ],
    };
  }

  async #subscribe() {
    await loadBeneficiaries();
    this.#subscriptions.push(
      await payment
        .collection("beneficiary")
        .subscribe({ tenantId: auth.user.tenant.id }, { sort: { label: 1 } }, (beneficiaries) => {
          this.setState("items", this.#getMenuItems(beneficiaries));
        }),
    );
  }

  #getMenuItems(beneficiaries: Beneficiary[]): MenuItem[] {
    return [
      {
        title: "Dashboard",
        url: "/",
        icon: SquareTerminal,
      },
      {
        title: "Beneficiaries",
        url: "#",
        icon: Book,
        isActive: true,
        items: [
          {
            title: "Create Beneficiary",
            icon: CirclePlusIcon,
            component: DialogCreateBeneficiary,
          },
          ...beneficiaries.map((beneficiary) => ({
            title: beneficiary.label ?? "Unlabeled",
            url: `/beneficiaries/${beneficiary._id}`,
          })),
        ],
      },
    ];
  }
}

type MenuItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SubMenuItem[];
};

type SubMenuItem =
  | {
      title: string;
      url: string;
    }
  | {
      title: string;
      icon: LucideIcon;
      component: FunctionComponent<{ title: string; icon: LucideIcon }>;
    };
