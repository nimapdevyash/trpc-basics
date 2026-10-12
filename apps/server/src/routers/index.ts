import { trpcServerInstance } from "../../configs/trpc";
import { todoRouter } from "./todo";
import { userRouter } from "./user";

export const globalRouter = trpcServerInstance.router({
  todo: todoRouter,
  user: userRouter,
});
