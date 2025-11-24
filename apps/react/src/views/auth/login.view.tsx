import { useController } from "../../libraries/controller.ts";
import { LoginForm } from "./components/login-form.tsx";
import { LoginController } from "./login.controller.ts";

export function LoginView() {
  const [, , { passkey }] = useController(LoginController);
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm passkey={passkey} />
      </div>
    </div>
  );
}
