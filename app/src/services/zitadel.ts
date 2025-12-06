import { createZitadelAuth, type ZitadelConfig } from "@zitadel/react";

const config: ZitadelConfig = {
  authority: "https://iam.valkyrjs.com",
  project_resource_id: "348389288439709700",
  client_id: "348389308220112900",
  redirect_uri: "http://localhost:5173/auth/callback",
  post_logout_redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "openid profile email urn:zitadel:iam:user:metadata urn:zitadel:iam:org:id:348388915649970180",
};

export const zitadel = createZitadelAuth(config);

export type ZitadelUser = NonNullable<Awaited<ReturnType<typeof zitadel.userManager.getUser>>>;
