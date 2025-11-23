import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { zitadel } from "../../services/zitadel.ts";

export function CallbackView() {
  const navigate = useNavigate();
  useEffect(() => {
    async function handleCallback() {
      try {
        const user = await zitadel.userManager.signinRedirectCallback();
        if (user) {
          navigate({ to: "/", replace: true });
        } else {
          navigate({ to: "/", replace: true });
        }
      } catch (error) {
        console.error("Callback error", error);
        navigate({ to: "/", replace: true });
      }
    }
    handleCallback();
  }, [navigate]);

  return null;
}
