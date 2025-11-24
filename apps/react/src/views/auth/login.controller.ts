import { Controller } from "../../libraries/controller.ts";

export class LoginController extends Controller {
  async passkey(email: string) {
    const result = await fetch("https://auth.valkyrjs.com/v2/sessions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        checks: {
          user: {
            loginName: email,
          },
        },
        challenges: {
          webAuthN: {
            domain: "auth.valkyrjs.com",
            userVerificationRequirement: "USER_VERIFICATION_REQUIREMENT_REQUIRED",
          },
        },
      }),
    });

    console.log(await result.text());
  }
}
