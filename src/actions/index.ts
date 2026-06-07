import { loginAction } from "./auth/loginAction";
import { registerAction } from "./auth/registerAction";
import { signoutAction } from "./auth/signoutAction";
import { setFavoriteAction } from "./lodges/setFavoriteAction";
import { setTourVariantFavoriteAction } from "./tours/setTourVariantFavoriteAction";

export const server = {
  login: loginAction,
  register: registerAction,
  signout: signoutAction,
  setFavorite: setFavoriteAction,
  setTourVariantFavorite: setTourVariantFavoriteAction,
};
