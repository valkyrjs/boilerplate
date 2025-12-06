import type { LucideIcon } from "lucide-react";

import { payment } from "@/database/payment.ts";
import { Controller } from "@/lib/controller.tsx";
import { api, getSuccessResponse } from "@/services/api.ts";
import { User } from "@/services/user.ts";

export class CreateBeneficiaryController extends Controller<
  {
    isSubmitting: boolean;
  },
  { title: string; icon: LucideIcon }
> {
  #label?: string;

  async onInit() {
    return {
      isSubmitting: false,
    };
  }

  setLabel(label: string) {
    this.#label = label;
  }

  async submit() {
    this.setState("isSubmitting", true);
    const res = await api.payment.benficiaries.create({
      body: {
        tenantId: await User.getTenantId(),
        label: this.#label,
      },
    });
    if ("data" in res) {
      await payment
        .collection("beneficiary")
        .insertOne(await getSuccessResponse(api.payment.benficiaries.id({ params: { id: res.data } })));
    }
    this.setState("isSubmitting", false);
  }
}
