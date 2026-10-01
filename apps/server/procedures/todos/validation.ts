import * as z from "zod";

export const idValidation = z.object({
  id: z.number(),
});

export const taskValidation = z.object({
  task: z.string().trim().nonempty(),
});

export const todoObjectValidation = z.object({
  id: z.number(),
  task: z.string().trim().nonempty(),
  isCompleted: z.boolean(),
});

export const todosOutputValidation = z.array(
  z.object({
    id: z.number(),
    task: z.string().trim().nonempty(),
    isCompleted: z.boolean(),
  }),
);

export type Id = z.infer<typeof idValidation>;
export type Task = z.infer<typeof taskValidation>;
export type Todo = z.infer<typeof todoObjectValidation>;
