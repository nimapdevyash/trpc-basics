import {
  addTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  toggleComplete,
} from "./procedures";
import { trpcServerInstance } from "./trpc";

export const globalRouter = trpcServerInstance.router({
  addTodo,
  deleteTodo,
  toggleComplete,
  getAllTodos,
  getTodoById,
});
