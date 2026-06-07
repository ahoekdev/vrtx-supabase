import { loginAction } from "./auth/loginAction";
import { registerAction } from "./auth/registerAction";
import { signoutAction } from "./auth/signoutAction";

export const server = {
  login: loginAction,
  register: registerAction,
  signout: signoutAction,
};
