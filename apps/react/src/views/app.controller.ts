import { Controller } from "../libraries/controller.ts";
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
      zitadel.authorize();
      return false;
    }
    return true;
  }

  signout() {
    zitadel.signout();
  }
}
