import Database from "better-sqlite3";
import * as schemas from "../../src/schema";
import * as relations from "../../src/relations";
import { drizzle } from "drizzle-orm/better-sqlite3";

const DatabaseClientInstance = new Database("./dbFile.db");
DatabaseClientInstance.pragma("foreign_keys = ON");

export const db = drizzle(DatabaseClientInstance, {
  schema: { ...schemas, ...relations },
});
