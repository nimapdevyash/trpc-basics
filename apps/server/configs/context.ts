import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import * as db from "../utils/todo";

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  return {
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
