import * as z from "zod";

const todo = z.object({
  id: z.number(),
  task: z.string(),
  isCompleted: z.boolean(),
});

export type Todo = z.infer<typeof todo>;

export type OperatioinType = "map" | "filter" | "push";
