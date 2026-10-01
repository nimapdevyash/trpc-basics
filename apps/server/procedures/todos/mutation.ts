import { Task } from "./validation";
import { Context } from "../../configs/context";

export const addTodo = ({ input, ctx }: { input: Task, ctx: Context }) => {
  return ctx.db.addTodoHelper(input)
};

export const deleteTodo = ({
  input,
  ctx,
}: {
  input: { id: number };
  ctx: Context;
}) =>  ctx.db.deleteTodoHelper(input);

export const toggleComplete = ({
  input,
  ctx,
}: {
  input: { id: number };
  ctx: Context;
}) => ctx.db.toggleTodoHelper(input);
