import { createLodgeAction } from "./lodge/createLodgeAction";
import { deleteLodgeAction } from "./lodge/deleteLodgeAction";

export const server = {
  createLodge: createLodgeAction,
  deleteLodge: deleteLodgeAction,
};
