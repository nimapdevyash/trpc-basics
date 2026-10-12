import { trpcServerInstance } from "../../configs/trpc";
import * as authProcess from "../procedures/auth";

export const authRouter = trpcServerInstance.router({
  login: authProcess.login,
});
