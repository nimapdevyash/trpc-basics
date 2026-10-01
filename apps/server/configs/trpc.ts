import { initTRPC } from "@trpc/server";
import { Context } from "./context";

export const trpcServerInstance = initTRPC.context<Context>().create();
