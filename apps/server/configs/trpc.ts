import { initTRPC } from "@trpc/server";
import { Context } from "./context";

export const trpcServerInstance = initTRPC.context<Context>().create();

export const publictProcedure = trpcServerInstance.procedure;
export const privateProcedure = trpcServerInstance.procedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user) throw new Error("Only SignedIn Users Are Allowed");

    return next({ ctx });
  },
);
