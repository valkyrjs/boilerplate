import { createZitadelAuth, type ZitadelConfig } from "@zitadel/react";

const config: ZitadelConfig = {
  authority: "https://auth.valkyrjs.com",
  client_id: "347982179092987909",
  redirect_uri: "http://localhost:5173/callback",
  post_logout_redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "openid profile email",
};

export const zitadel = createZitadelAuth(config);

export type User = NonNullable<Awaited<ReturnType<typeof zitadel.userManager.getUser>>>;
