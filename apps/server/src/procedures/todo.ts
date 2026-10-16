import { privateProcedure } from "../../configs/trpc";
import * as todoService from "../services/todo";
import { idValidation } from "../validations";
import { taskValidation } from "../validations/todo";

// mutations
export const add = privateProcedure
  .input(taskValidation)
  // .output(todosOutputValidation)
  .mutation(todoService.addTodo);

export const remove = privateProcedure
  .input(idValidation)
  // .output(todosOutputValidation)
  .mutation(todoService.deleteTodo);

export const toggle = privateProcedure
  .input(idValidation)
  .mutation(todoService.toggleComplete);
// .output(todosOutputValidation)

// query
export const getAll = privateProcedure
  // .output(todosOutputValidation)
  .query(todoService.getAllTodos);

export const getById = privateProcedure
  .input(idValidation)
  // .output(todoObjectValidation.optional())
  .query(todoService.getTodoById);
