import type { Beneficiary } from "@module/payment/client";

import { payment } from "@/database/payment.ts";
import { Controller } from "@/lib/controller.tsx";
import { auth } from "@/services/auth.ts";

export class ReadBeneficiaryController extends Controller<
  {
    beneficiary?: Beneficiary;
  },
  {
    id: string;
  }
> {
  #subscription?: any;

  async onInit() {
    await this.#subscribe(this.props.id);
  }

  async onResolve() {
    await this.#subscribe(this.props.id);
  }

  async onDestroy(): Promise<void> {
    this.#subscription?.unsubscribe();
  }

  async #subscribe(_id: string) {
    this.#subscription?.unsubscribe();
    this.#subscription = await payment
      .collection("beneficiary")
      .subscribe({ _id, tenantId: auth.user.tenant.id }, { limit: 1 }, (beneficiary) => {
        this.setState("beneficiary", beneficiary);
      });
  }
}
