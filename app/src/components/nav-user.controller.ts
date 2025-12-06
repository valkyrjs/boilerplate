import { Controller } from "@/lib/controller.tsx";
import { User } from "@/services/user.ts";
import { zitadel } from "@/services/zitadel.ts";

export class NavUserController extends Controller<{
  user: User;
}> {
  async onInit() {
    return {
      user: await this.#getAuthenticatedUser(),
    };
  }

  async #getAuthenticatedUser(): Promise<User> {
    const user = await User.resolve();
    if (user === undefined) {
      throw new Error("Failed to resolve user session");
    }
    return user;
  }

  signout() {
    zitadel.signout();
  }
}
