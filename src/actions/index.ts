import { loginAction } from "./auth/loginAction";
import { registerAction } from "./auth/registerAction";

export const server = {
  login: loginAction,
  register: registerAction,
};
