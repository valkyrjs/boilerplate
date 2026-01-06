import type { LucideIcon } from "lucide-react";

import { payment } from "@/database/payment.ts";
import { Controller } from "@/lib/controller.tsx";
import { api, getSuccessResponse } from "@/services/api.ts";
import { auth } from "@/services/auth.ts";

export class CreateBeneficiaryController extends Controller<
  {
    isSubmitting: boolean;
    label: string;
  },
  { title: string; icon: LucideIcon }
> {
  async onInit() {
    return {
      isSubmitting: false,
      label: "",
    };
  }

  setLabel(label: string) {
    this.setState("label", label);
  }

  async submit() {
    this.setState("isSubmitting", true);
    const res = await api.payment.benficiaries.create({
      body: {
        tenantId: auth.user.tenant.id,
        label: this.state.label,
      },
    });
    if ("data" in res) {
      await payment
        .collection("beneficiary")
        .insertOne(await getSuccessResponse(api.payment.benficiaries.id({ params: { id: res.data } })));
    }
    this.setState({
      isSubmitting: false,
      label: "",
    });
  }
}
