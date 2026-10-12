import { publictProcedure } from "../../configs/trpc";
import * as userService from "../services/user";
import { idValidation } from "../validations";
import * as userValidation from "../validations/user";

export const createUser = publictProcedure
  .input(userValidation.createUserAccountValidation)
  .mutation(userService.createUserAccount);

export const updateUser = publictProcedure
  .input(userValidation.updateUserAccountValidation)
  .mutation(userService.updateUserAccount);

export const deleteUser = publictProcedure
  .input(idValidation)
  .mutation(userService.deleteUserAccount);

export const getMyUserAccount = publictProcedure.query(
  userService.getMyUserAccount,
);

export const getUserAccountById = publictProcedure
  .input(idValidation)
  .query(userService.getUserAccountById);

export const getAllUserAccounts = publictProcedure.query(
  userService.getAllUserAccounts,
);
