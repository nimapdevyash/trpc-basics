import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { db } from "./database/index";
import { users } from "../src/schema";
import * as jwt from "../utils/jwt";
import { eq } from "drizzle-orm";

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  const authToken = req.headers.authorization?.split(" ")[1];

  if (!authToken) return { db };
  const decodedJwtToken = jwt.verifyToken(authToken);

  const existingUserRecord = await db
    .select()
    .from(users)
    .where(eq(users.id, decodedJwtToken.id));

  if (!existingUserRecord) return { db };

  return {
    db,
    user: {
      id: existingUserRecord[0].id,
      name: existingUserRecord[0].name,
    },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
