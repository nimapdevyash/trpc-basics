import { trpcServerInstance } from "../../configs/trpc";
import { addTodo, deleteTodo, toggleComplete } from "./mutation";
import { getAllTodos, getTodoById } from "./query";
import {
  idValidation,
  taskValidation,
  todoObjectValidation,
  todosOutputValidation,
} from "./validation";

const todoProcedure = trpcServerInstance.procedure;

// mutations
export const add = todoProcedure
  .input(taskValidation)
  .output(todosOutputValidation)
  .mutation(addTodo);

export const remove = todoProcedure
  .input(idValidation)
  .output(todosOutputValidation)
  .mutation(deleteTodo);

export const toggle = todoProcedure
  .input(idValidation)
  .output(todosOutputValidation)
  .mutation(toggleComplete);

// query
export const getAll = todoProcedure
  .output(todosOutputValidation)
  .query(getAllTodos);

export const getById = todoProcedure
  .input(idValidation)
  .output(todoObjectValidation.optional())
  .query(getTodoById);
