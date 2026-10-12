import { trpcServerInstance } from "../../configs/trpc";
import { authRouter } from "./auth";
import { todoRouter } from "./todo";
import { userRouter } from "./user";

export const globalRouter = trpcServerInstance.router({
  auth: authRouter,
  todo: todoRouter,
  user: userRouter,
});
