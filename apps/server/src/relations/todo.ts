import { relations } from "drizzle-orm";
import { todos } from "../schema/todos";
import { users } from "../schema/users";

export const todoRelations = relations(todos, ({one}) => ({
  creator: one(users, {
    fields: [todos.createdBy],
    references: [users.id]
  })
}))
