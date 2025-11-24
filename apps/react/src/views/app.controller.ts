import { Controller } from "../libraries/controller.ts";
import { router } from "../router.tsx";
import { zitadel } from "../services/zitadel.ts";

export class AppController extends Controller<{
  authenticated: boolean;
}> {
  async onInit() {
    return {
      authenticated: await this.#getAuthenticatedState(),
    };
  }

  async #getAuthenticatedState(): Promise<boolean> {
    const user = await zitadel.userManager.getUser();
    if (user === null) {
      router.navigate({ to: "/login" });
      return false;
    }
    return true;
  }

  signout() {
    zitadel.signout();
  }
}
