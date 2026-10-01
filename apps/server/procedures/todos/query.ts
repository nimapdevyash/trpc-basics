import { Context } from "../../configs/context";
import { Id } from "./validation";

export const getAllTodos = ({ ctx }: { ctx: Context }) => ctx.db.getAllTodosHelper();

export const getTodoById = ({ input, ctx }: { input: Id; ctx: Context }) => {
  ctx.db.checkIfIdIsValid(input.id);
  return ctx.db.getTodoByIdHelper(input);
};
