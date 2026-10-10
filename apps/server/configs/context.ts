import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { db } from "./database/index";

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  return { db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
