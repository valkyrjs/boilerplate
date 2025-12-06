import { CurrencySchema } from "@module/payment/client";
import type { LucideIcon } from "lucide-react";

import { api } from "@/services/api.ts";

import { Controller } from "../../lib/controller.tsx";

export class CreateLedgerController extends Controller<
  {
    isSubmitting: boolean;
  },
  { title: string; icon: LucideIcon }
> {
  #label?: string;
  #currencies: string[] = [];

  async onInit() {
    return {
      isSubmitting: false,
    };
  }

  setLabel(label: string) {
    this.#label = label;
  }

  setCurrencies(currencies: string[]) {
    this.#currencies = currencies;
  }

  async submit() {
    this.setState("isSubmitting", true);
    const result = await api.payment.ledger.create({
      body: {
        beneficiaryId: crypto.randomUUID(),
        label: this.#label,
        currencies: this.#currencies.map((currency) => CurrencySchema.parse(currency)),
      },
    });
    console.log(result);
    this.setState("isSubmitting", false);
  }
}
