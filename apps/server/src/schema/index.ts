import { integer } from "drizzle-orm/sqlite-core";

export const id = {
  id: integer("id").primaryKey({ autoIncrement: true }),
};

export const timeStamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
};
