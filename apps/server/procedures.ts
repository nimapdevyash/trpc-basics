import * as z from "zod";
import { trpcServerInstance } from "./trpc";
import { Todo } from "types";

export let id = 0;
export let todos: Todo[] = [];

export const getAllTodos = trpcServerInstance.procedure.query(() => todos);

export const getTodoById = trpcServerInstance.procedure
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .query(({ input }) => todos.find((todo) => todo.id === input.id));

export const addTodo = trpcServerInstance.procedure
  .input(
    z.object({
      task: z.string(),
    }),
  )
  .mutation(({ input }) => {
    todos.push({
      id: ++id,
      task: input.task,
      isCompleted: false,
    });

    return todos;
  });

export const deleteTodo = trpcServerInstance.procedure
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .mutation(({ input }) => {
    todos = todos.filter((todo) => todo.id !== input.id);
    return todos;
  });

export const toggleComplete = trpcServerInstance.procedure
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .mutation(({ input }) => {
    todos = todos.map((todo) =>
      todo.id === input.id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
    );
    return todos;
  });
