import { trpcServerInstance } from "../configs/trpc";
import { todoRouter } from "./todo";

export const globalRouter = trpcServerInstance.router({
  todo: todoRouter,
});
