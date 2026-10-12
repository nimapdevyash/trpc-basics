import { publictProcedure } from "../../configs/trpc";
import * as authService from "../services/auth";
import { loginValidation } from "../validations/auth";

export const login = publictProcedure
  .input(loginValidation)
  .mutation(authService.userLogin);
