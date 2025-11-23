import { Controller } from "../../libraries/controller.ts";
import { type User, zitadel } from "../../services/zitadel.ts";

export class LoginController extends Controller<{
  user?: User;
}> {
  async onInit() {
    return {
      user: await this.#getAuthenticationState(),
    };
  }

  async #getAuthenticationState(): Promise<User | undefined> {
    return zitadel.userManager.getUser().then((user) => {
      if (user === null) {
        return undefined;
      }
      return user;
    });
  }

  login() {
    zitadel.authorize();
  }

  logout() {
    zitadel.signout();
  }
}
