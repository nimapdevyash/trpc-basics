import { trpcServerInstance } from "../configs/trpc";
import { add, getAll, getById, remove, toggle } from "../procedures/todos";

export const todoRouter = trpcServerInstance.router({
  add,
  remove,
  toggle,
  getAll,
  getById,
});
