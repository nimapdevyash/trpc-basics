import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timeStamps } from "./index";
import { users } from "./users";

export const todos = sqliteTable("todos", {
  task: text("task").notNull(),
  isCompleted: integer({ mode: "boolean" }).default(false),
  createdBy: integer().references(() => users.id, {onDelete: "cascade"}).notNull(),

  ...id,
  ...timeStamps,
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
