import { publictProcedure } from "../../configs/trpc";
import * as todoService from "../services/todo";
import {
  idValidation,
  taskValidation,
  todoObjectValidation,
  todosOutputValidation,
} from "../validations/todo";

// mutations
export const add = publictProcedure
  .input(taskValidation)
  // .output(todosOutputValidation)
  .mutation(todoService.addTodo);

export const remove = publictProcedure
  .input(idValidation)
  // .output(todosOutputValidation)
  .mutation(todoService.deleteTodo);

export const toggle = publictProcedure
  .input(idValidation)
  // .output(todosOutputValidation)
  .mutation(todoService.toggleComplete);

// query
export const getAll = publictProcedure
  // .output(todosOutputValidation)
  .query(todoService.getAllTodos);

export const getById = publictProcedure
  .input(idValidation)
  // .output(todoObjectValidation.optional())
  .query(todoService.getTodoById);
