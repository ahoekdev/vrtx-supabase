import { loginAction } from "./auth/loginAction";
import { registerAction } from "./auth/registerAction";
import { createLodgeAction } from "./lodge/createLodgeAction";
import { deleteLodgeAction } from "./lodge/deleteLodgeAction";

export const server = {
  createLodge: createLodgeAction,
  deleteLodge: deleteLodgeAction,
  login: loginAction,
  register: registerAction,
};
