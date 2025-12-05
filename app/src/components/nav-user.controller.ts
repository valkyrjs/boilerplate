import { Controller } from "@/lib/controller.tsx";
import { type User as ZitadelUser, zitadel } from "@/services/zitadel.ts";

export class NavUserController extends Controller<{
  user: User;
}> {
  async onInit() {
    return {
      user: await this.#getAuthenticatedUser(),
    };
  }

  async #getAuthenticatedUser(): Promise<User> {
    const user = await zitadel.userManager.getUser();
    if (user === null) {
      throw new Error("Failed to resolve user session");
    }
    return getUserProfile(user);
  }

  signout() {
    zitadel.signout();
  }
}

function getUserProfile({ profile }: ZitadelUser): User {
  const user: User = { name: "Unknown", email: "unknown@acme.none", avatar: "" };
  if (profile.name) {
    user.name = profile.name;
  } else if (profile.given_name && profile.family_name) {
    user.name = `${profile.given_name} ${profile.family_name}`;
  } else if (profile.given_name) {
    user.name = profile.given_name;
  }
  if (profile.email) {
    user.email = profile.email;
  }
  if (profile.picture !== undefined) {
    user.avatar = profile.picture;
  }
  return user;
}

type User = {
  name: string;
  email: string;
  avatar: string;
};
