import { relations } from "drizzle-orm";
import { users } from "../schema/users";
import { todos } from "../schema/todos";

export const userRelations = relations(users, ({many}) => ({
  todos: many(todos)
}))
