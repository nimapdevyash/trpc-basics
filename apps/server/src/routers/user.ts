import { trpcServerInstance } from "../../configs/trpc";
import * as userProcedure from "../procedures/user";

export const userRouter = trpcServerInstance.router({
  create: userProcedure.createUser,
  update: userProcedure.updateUser,
  delete: userProcedure.deleteUser,
  getMyUserAccount: userProcedure.getMyUserAccount,
  getUserAccountById: userProcedure.getUserAccountById,
  getAllUserAccounts: userProcedure.getAllUserAccounts,
});
