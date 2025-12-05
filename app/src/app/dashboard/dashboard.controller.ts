import { Controller } from "@/lib/controller.tsx";
import { api } from "@/services/api.ts";

export class DashboardController extends Controller<{
  beneficiaries: any[];
}> {
  async onInit() {
    return {
      beneficiaries: await this.#getBenficiaries(),
    };
  }

  async #getBenficiaries() {
    const response = await api.ledger.benficiaries.list();
    if ("error" in response) {
      return [];
    }
    return response.data;
  }
}
