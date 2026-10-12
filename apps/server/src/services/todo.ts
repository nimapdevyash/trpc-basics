import { Task, Id } from "../validations/todo";
import { Context } from "../../configs/context";
import { todos } from "../schema";
import { and, eq } from "drizzle-orm";

/***************************** Query ********************************/

export const getAllTodos = async ({ ctx }: { ctx: Context }) =>
  await ctx.db.select().from(todos);

export const getTodoById = async ({
  input,
  ctx,
}: {
  input: { id: number };
  ctx: Context;
}) => await ctx.db.select().from(todos).where(eq(todos.id, input.id));

/***************************** Mutations  ********************************/

export const addTodo = ({ input, ctx }: { input: Task; ctx: Context }) => {
  if (!ctx.user) throw new Error("Only Loggedin User can create tasks");

  ctx.db.insert(todos).values({
    task: input.task,
    createdBy: ctx.user.id,
  });
};

export const deleteTodo = async ({
  input,
  ctx,
}: {
  input: { id: number };
  ctx: Context;
}) => {
  if (!ctx.user) throw new Error("Only Loggedin Owners Could Delete the Todos");
  await ctx.db
    .delete(todos)
    .where(and(eq(todos.createdBy, ctx.user?.id), eq(todos.id, input.id)));
};

export const toggleComplete = async ({
  input,
  ctx,
}: {
  input: { id: number };
  ctx: Context;
}) => {
  if (!ctx.user) throw new Error("Only Loggedin Owner Could Toggle");

  const todo = await ctx.db
    .select()
    .from(todos)
    .where(and(eq(todos.id, input.id), eq(todos.createdBy, ctx.user.id)));

  if (!todo[0]) throw new Error("Todo Not Found");

  ctx.db.update(todos).set({
    isCompleted: !todo[0].isCompleted,
  });

  return `Todo is Marked as ${todo[0].isCompleted ? "Un-Completed" : "Completed"}`;
};
