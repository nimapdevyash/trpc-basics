import { privateProcedure, publictProcedure } from "../../configs/trpc";
import * as userService from "../services/user";
import { idValidation } from "../validations";
import * as userValidation from "../validations/user";

export const createUser = publictProcedure
  .input(userValidation.createUserAccountValidation)
  .mutation(userService.createUserAccount);

export const updateUser = privateProcedure
  .input(userValidation.updateUserAccountValidation)
  .mutation(({ ctx, input }) =>
    userService.updateUserAccount({ userId: ctx.user.id, input }),
  );

export const deleteUser = privateProcedure
  .input(idValidation)
  .mutation(userService.deleteUserAccount);

export const getMyUserAccount = privateProcedure.query(
  userService.getMyUserAccount,
);

export const getUserAccountById = publictProcedure
  .input(idValidation)
  .query(userService.getUserAccountById);

export const getAllUserAccounts = publictProcedure.query(
  userService.getAllUserAccounts,
);

export const test = privateProcedure.mutation(({ ctx }) => ctx.user.id);
