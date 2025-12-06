import { redirect } from "@tanstack/react-router";
import z from "zod";

import { type ZitadelUser, zitadel } from "./zitadel.ts";

let cached: User | undefined;

const TenantSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  domain: z.string(),
});

const ProfileSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
});

export class User {
  readonly id: string;

  readonly name: string;
  readonly email: string;
  readonly avatar: string;

  readonly tenant: Tenant;

  constructor({ id, name, email, avatar }: Profile, tenant: Tenant) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.tenant = tenant;
  }

  static async getTenantId() {
    return User.get().then((user) => user.tenant.id);
  }

  static async getTenantName() {
    return User.get().then((user) => user.tenant.name);
  }

  static async get() {
    const user = await User.resolve();
    if (user === undefined) {
      throw redirect({ to: "/login" });
    }
    return user;
  }

  static async resolve() {
    if (cached === undefined) {
      const user = await zitadel.userManager.getUser();
      if (user === null) {
        return undefined;
      }
      cached = new User(
        getUserProfile(user),
        TenantSchema.parse({
          id: user.profile["urn:zitadel:iam:org:id"],
          name: user.profile["urn:zitadel:iam:user:resourceowner:name"],
          domain: user.profile["urn:zitadel:iam:user:resourceowner:primary_domain"],
        }),
      );
    }
    return cached;
  }
}

function getUserProfile({ profile }: ZitadelUser): Profile {
  const user: Profile = { id: profile.client_id as string, name: "Unknown", email: "unknown@acme.none", avatar: "" };
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

type Tenant = z.output<typeof TenantSchema>;
type Profile = z.output<typeof ProfileSchema>;
