import { useController } from "../../libraries/controller.ts";
import { LoginController } from "./login.controller.ts";

export function LoginView() {
  const [{ user }, { login, logout }] = useController(LoginController);
  return (
    <div>
      <button type="button" onClick={() => (user === undefined ? login() : logout())}>
        {user === undefined ? "Login" : "Logout"}
      </button>
      {user !== undefined ? <pre>{JSON.stringify(user, null, 2)}</pre> : null}
    </div>
  );
}
