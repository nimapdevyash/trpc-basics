import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timeStamps } from "./commonComponents";

export const users = sqliteTable("users", {
  name: text("name").notNull().unique(),
  password: text("passowrd").notNull(),
  email: text("email").notNull().unique(),

  ...id,
  ...timeStamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
